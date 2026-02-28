import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core"
import { useEffect, useState } from "react"
import { apiRequest, supabase } from "../supabase"
import Column from "./Column"

const BOARD_ID = "main"

export default function Board() {
  const [columns, setColumns] = useState([])
  const [tasks, setTasks] = useState([])
  const [userTags, setUserTags] = useState([])
  const [activeTask, setActiveTask] = useState(null)

  function handleDragStart(event) {
    const taskId = event.active.data.current.taskId
    const task = tasks.find((t) => t.id === taskId)
    if (task) setActiveTask(task)
  }

  async function handleDragEnd(event) {
    const { active, over } = event

    setActiveTask(null)

    if (!over) return

    const taskId = active.data.current.taskId
    const newColumnId = over.data.current.columnId

    if (!taskId || !newColumnId) return

    const task = tasks.find((t) => t.id === taskId)

    if (!task) return
    if (task.column_id === newColumnId) return

    // optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, column_id: newColumnId } : t))
    )

    const { error } = await apiRequest(
      supabase.from("tasks").update({ column_id: newColumnId }).eq("id", taskId)
    )

    if (error) {
      console.error(error)
      await fetchData()
    }
  }

  async function fetchTags() {
    const { data } = await apiRequest(supabase.from("tags").select("*"))
    if (data) setUserTags(data)
  }

  // get data
  async function fetchData() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: columnsData } = await apiRequest(
      supabase.from("columns").select("*").eq("user_id", user.id).order("order")
    )

    const { data: tasksData } = await apiRequest(
      supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
    )

    if (columnsData) setColumns(columnsData)
    if (tasksData) setTasks(tasksData)

    await fetchTags()
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
  }, [])

  // add column
  async function addColumn() {
    const {
      data: { user }
    } = await supabase.auth.getUser()
    const newOrder = columns.length

    const { data } = await apiRequest(
      supabase
        .from("columns")
        .insert({
          title: `Column ${newOrder + 1}`,
          board_id: BOARD_ID,
          order: newOrder,
          user_id: user.id
        })
        .select()
        .single()
    )

    if (data) setColumns([...columns, data])
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <div className="board">
        {columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={tasks.filter((t) => t.column_id === col.id)}
            refresh={fetchData}
            setTasks={setTasks}
            userTags={userTags}
            refreshTags={fetchTags}
          />
        ))}

        <button className="add-column" onClick={addColumn}>
          + Add Column
        </button>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="task dragging">
            <div className="drag-handle">⋮⋮</div>
            <div className="task-content">
              <span>{activeTask.title}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
