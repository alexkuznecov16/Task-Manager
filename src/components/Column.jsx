import { useState } from "react"
import { apiRequest, supabase } from "../supabase"
import Task from "./Task"

export default function Column({
  column,
  tasks,
  refresh,
  setTasks,
  userTags,
  refreshTags
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(column.title)

  async function deleteColumn() {
    const { error } = await apiRequest(
      supabase.from("columns").delete().eq("id", column.id)
    )

    if (error) {
      console.error("Error deleting column:", error.message)
      alert("Error deleting column: " + error.message)
    } else {
      refresh()
      setIsDeleting(false)
    }
  }

  async function addTask() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    const newTask = {
      id: Math.random(),
      title: "New task",
      column_id: column.id,
      user_id: user.id,
      completed: false,
      order: tasks.length
    }

    setTasks((prev) => [...prev, newTask])

    await apiRequest(
      supabase.from("tasks").insert({
        title: "New task",
        column_id: column.id,
        user_id: user.id,
        completed: false,
        order: tasks.length
      })
    )
    refresh()
  }

  async function updateColumnTitle() {
    if (newTitle.trim() === "" || newTitle === column.title) {
      setIsEditing(false)
      return
    }

    const { error } = await apiRequest(
      supabase.from("columns").update({ title: newTitle }).eq("id", column.id)
    )

    if (error) {
      console.error("Error updating column:", error.message)
    } else {
      setIsEditing(false)
      refresh()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") updateColumnTitle()
    if (e.key === "Escape") {
      setNewTitle(column.title)
      setIsEditing(false)
    }
  }

  return (
    <div className="column">
      {isDeleting && (
        <div className="deleting-modal-overlay">
          <div className="deleting-modal-content">
            <h3>
              Are you sure you want to delete the "{column.title}" column and
              all its tasks?
            </h3>
            <button type="button" onClick={deleteColumn}>
              Delete
            </button>
            <button type="button" onClick={() => setIsDeleting(false)}>
              No
            </button>
          </div>
        </div>
      )}

      <button
        className="btn_remove-column"
        onClick={() => setIsDeleting(true)}
        title="Remove column">
        ×
      </button>
      <div
        className="column-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
        {isEditing ? (
          <input
            className="edit-column-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={updateColumnTitle}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <h3
            onClick={() => setIsEditing(true)}
            style={{ cursor: "pointer", flex: 1 }}>
            {column.title}
          </h3>
        )}
      </div>

      <div className="tasks-container">
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            refresh={refresh}
            userTags={userTags}
            refreshTags={refreshTags}
          />
        ))}

        <button onClick={addTask}>+ Add Task</button>
      </div>
    </div>
  )
}
