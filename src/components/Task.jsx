import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import TaskModal from "./TaskModal"
import { useState } from "react"
import { useBoard } from "../context/BoardContext"

export default function Task({ task }) {
  const [showModal, setShowModal] = useState(false)
  const { tasks, deleteTask, toggleTaskComplete, createTag, deleteTag, tags } =
    useBoard()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useDraggable({
    id: `task-${task.id}`,
    data: { taskId: task.id, columnId: task.column_id }
  })

  const taskData = tasks.find((t) => t.id === task.id)

  if (!taskData) {
    return <div style={{ display: "none" }} />
  }

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
    cursor: isDragging ? "grabbing" : "grab"
  }

  const tagColors = tags.reduce((acc, t) => {
    acc[t.name.toLowerCase()] = t.color
    return acc
  }, {})

  return (
    <>
      <div
        className={`task ${taskData.completed ? "done" : ""}`}
        ref={setNodeRef}
        style={style}>
        <div className="drag-handle" {...attributes} {...listeners}>
          ⋮⋮
        </div>
        <div className="tag-indicators">
          {taskData.tags
            ?.split(",")
            .filter(Boolean)
            .map((tag) => (
              <div
                key={tag}
                className="tag-bar"
                style={{
                  background: tagColors[tag.toLowerCase()] || "#334155"
                }}
              />
            ))}
        </div>
        <div className="task-content">
          <span onClick={() => setShowModal(true)}>{taskData.title}</span>
        </div>
        <div className="task-controls">
          <button
            className="complete-btn"
            onClick={(e) => {
              e.stopPropagation()
              toggleTaskComplete(taskData.id)
            }}>
            {taskData.completed ? "↩" : "✓"}
          </button>
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation()
              deleteTask(taskData.id)
            }}>
            ✕
          </button>
        </div>
      </div>

      {showModal && (
        <TaskModal
          task={taskData}
          userTags={tags}
          onCreateTag={createTag}
          onDeleteTag={deleteTag}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
