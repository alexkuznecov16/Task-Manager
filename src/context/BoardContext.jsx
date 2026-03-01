import { createContext, useContext, useEffect, useState } from "react"
import { supabase, apiRequest } from "../supabase"
import { useNotification } from "../hooks/useNotification"

const BoardContext = createContext()

export function BoardProvider({ children }) {
  const addNotification = useNotification()

  const [user, setUser] = useState(null)
  const [columns, setColumns] = useState([])
  const [tasks, setTasks] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)

  // === INIT ===
  useEffect(() => {
    init()
  }, [])

  async function init() {
    setLoading(true)
    const {
      data: { user },
      error
    } = await supabase.auth.getUser()
    if (error) {
      addNotification(error.message, "error")
      setLoading(false)
      return
    }
    if (!user) {
      setLoading(false)
      return
    }

    setUser(user)
    await Promise.all([
      fetchColumns(user.id),
      fetchTasks(user.id),
      fetchTags(user.id)
    ])
    setLoading(false)
  }

  // === COLUMNS ===
  async function fetchColumns(userId) {
    const { data, error } = await apiRequest(
      supabase.from("columns").select("*").eq("user_id", userId).order("order")
    )
    if (error) {
      addNotification(error.message, "error")
      return
    }
    setColumns(data || [])
  }

  async function addColumn() {
    if (!user) return
    const newOrder = columns.length
    const { data, error } = await apiRequest(
      supabase
        .from("columns")
        .insert({
          title: `Column ${newOrder + 1}`,
          order: newOrder,
          user_id: user.id
        })
        .select()
        .single()
    )
    if (error)
      addNotification("Failed to add column: " + error.message, "error")
    else setColumns((prev) => [...prev, data])
  }

  async function deleteColumn(columnId) {
    setColumns((prev) => prev.filter((c) => c.id !== columnId))
    setTasks((prev) => prev.filter((t) => t.column_id !== columnId))

    const { error } = await apiRequest(
      supabase.from("columns").delete().eq("id", columnId)
    )
    if (error) {
      addNotification(error.message, "error")
      await fetchColumns(user.id)
      await fetchTasks(user.id)
    }
  }

  async function updateColumnTitle(columnId, newTitle) {
    setColumns((prev) =>
      prev.map((c) => (c.id === columnId ? { ...c, title: newTitle } : c))
    )
    const { error } = await apiRequest(
      supabase.from("columns").update({ title: newTitle }).eq("id", columnId)
    )
    if (error) {
      addNotification(error.message, "error")
      await fetchColumns(user.id)
    }
  }

  // === TASKS ===
  async function fetchTasks(userId) {
    const { data, error } = await apiRequest(
      supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at")
    )
    if (error) addNotification(error.message, "error")
    else setTasks(data || [])
  }

  async function addTask(columnId) {
    if (!user) return
    const { data, error } = await apiRequest(
      supabase
        .from("tasks")
        .insert({
          title: "New task",
          column_id: columnId,
          user_id: user.id
        })
        .select()
        .single()
    )
    if (error) addNotification(error.message, "error")
    else setTasks((prev) => [...prev, data])
  }

  async function deleteTask(taskId) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    const { error } = await apiRequest(
      supabase.from("tasks").delete().eq("id", taskId)
    )
    if (error) addNotification(error.message, "error")
  }

  async function moveTask(taskId, newColumnId) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, column_id: newColumnId } : t))
    )
    const { error } = await apiRequest(
      supabase.from("tasks").update({ column_id: newColumnId }).eq("id", taskId)
    )
    if (error) addNotification(error.message, "error")
  }

  async function toggleTaskComplete(taskId) {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return
    const newCompleted = !task.completed
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: newCompleted } : t))
    )
    const { error } = await apiRequest(
      supabase
        .from("tasks")
        .update({ completed: newCompleted })
        .eq("id", taskId)
    )
    if (error) addNotification(error.message, "error")
  }

  // === TAGS ===
  async function fetchTags(userId) {
    const { data, error } = await apiRequest(
      supabase.from("tags").select("*").eq("user_id", userId)
    )
    if (error) addNotification(error.message, "error")
    else setTags(data || [])
  }

  async function createTag(name, color) {
    if (!user || !name.trim()) return
    const cleanName = name.trim().toLowerCase()
    if (tags.some((t) => t.name === cleanName)) {
      addNotification("Tag already exists", "error")
      return
    }
    const { data, error } = await apiRequest(
      supabase
        .from("tags")
        .insert([{ name: cleanName, color, user_id: user.id }])
    )
    if (error) addNotification(error.message, "error")
    else setTags((prev) => [...prev, data[0]])
  }

  async function deleteTag(tagId) {
    setTags((prev) => prev.filter((t) => t.id !== tagId))
    const { error } = await apiRequest(
      supabase.from("tags").delete().eq("id", tagId)
    )
    if (error) addNotification(error.message, "error")
  }

  return (
    <BoardContext.Provider
      value={{
        user,
        columns,
        tasks,
        tags,
        loading,

        // columns
        addColumn,
        deleteColumn,
        updateColumnTitle,

        // tasks
        addTask,
        deleteTask,
        moveTask,
        toggleTaskComplete,

        // tags
        createTag,
        deleteTag
      }}>
      {children}
    </BoardContext.Provider>
  )
}

// hook
export function useBoard() {
  return useContext(BoardContext)
}
