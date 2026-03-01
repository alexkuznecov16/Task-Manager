import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useState } from "react"
import { apiRequest, supabase } from "../supabase"
import Task from "./Task"
import { useNotification } from "../hooks/useNotification"

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
  const addNotification = useNotification()

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: {
      columnId: column.id
    }
  })

  async function deleteColumn() {
    const { error } = await apiRequest(
      supabase.from("columns").delete().eq("id", column.id)
    )

    if (error) {
      addNotification("Failed to delete column: " + error.message, "error")
    } else {
      addNotification("Column deleted successfully", "success")
      refresh()
      setIsDeleting(false)
    }
  }

  async function addTask() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    const newTask = {
      id: Date.now(),
      title: "New task",
      column_id: column.id,
      user_id: user.id,
      completed: false,
      order: tasks.length
    }

    setTasks((prev) => [...prev, newTask])

    const { error } = await apiRequest(
      supabase.from("tasks").insert({
        title: "New task",
        column_id: column.id,
        user_id: user.id,
        completed: false,
        order: tasks.length
      })
    )

    if (error) {
      addNotification("Failed to add task: " + error.message, "error")
    } else {
      refresh()
    }
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
      addNotification("Failed to update title: " + error.message, "error")
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
            <button
              type="button"
              onClick={deleteColumn}
              className="save-btn-colors">
              Delete
            </button>
            <button
              type="button"
              onClick={() => setIsDeleting(false)}
              className="cancel-btn-colors">
              Cancel
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

      <div
        className="tasks-container"
        ref={setNodeRef}
        style={{
          background: isOver ? "rgba(99,102,241,0.15)" : ""
        }}>
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              refresh={refresh}
              userTags={userTags}
              refreshTags={refreshTags}
            />
          ))}
        </SortableContext>

        <button onClick={addTask}>+ Add Task</button>
      </div>
    </div>
  )
}
