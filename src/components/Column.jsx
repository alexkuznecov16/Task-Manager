import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useState } from "react"
import Task from "./Task"
import { useBoard } from "../context/BoardContext"

export default function Column({ column, tasks, userTags }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(column.title)
  const { addTask, deleteColumn, updateColumnTitle } = useBoard()

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: {
      columnId: column.id
    }
  })

  async function handleUpdateTitle() {
    if (newTitle.trim() === "" || newTitle === column.title) {
      setIsEditing(false)
      return
    }

    await updateColumnTitle(column.id, newTitle)
    setIsEditing(false)
  }

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") updateColumnTitle()
  //   if (e.key === "Escape") {
  //     setNewTitle(column.title)
  //     setIsEditing(false)
  //   }
  // }

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
              onClick={() => {
                deleteColumn(column.id)
                setIsDeleting(false)
              }}
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
            onBlur={handleUpdateTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUpdateTitle()
              if (e.key === "Escape") {
                setNewTitle(column.title)
                setIsEditing(false)
              }
            }}
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
            <Task key={task.id} task={task} userTags={userTags} />
          ))}
        </SortableContext>

        <button onClick={() => addTask(column.id)}>+ Add Task</button>
      </div>
    </div>
  )
}
