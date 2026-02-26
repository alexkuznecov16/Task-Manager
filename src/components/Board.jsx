import { useEffect, useState } from "react"
import { apiRequest, supabase } from "../supabase"
import Column from "./Column"

const BOARD_ID = "main"

export default function Board() {
  const [columns, setColumns] = useState([])
  const [tasks, setTasks] = useState([])
  const [userTags, setUserTags] = useState([])

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
  )
}
