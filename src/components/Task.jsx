import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import TaskModal from "./TaskModal"
import { useState } from "react"
import { apiRequest, supabase } from "../supabase"
import { useNotification } from "../hooks/useNotification"

export default function Task({ task, refresh, userTags, refreshTags }) {
  const [showModal, setShowModal] = useState(false)
  const addNotification = useNotification()

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

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
    cursor: isDragging ? "grabbing" : "grab"
  }

  async function deleteTag(tagId) {
    const { error } = await apiRequest(
      supabase.from("tags").delete().eq("id", tagId)
    )
    if (error) {
      addNotification("Failed to delete tag: " + error.message, "error")
    } else {
      addNotification("Tag deleted successfully", "success")
      await refreshTags()
    }
  }

  async function createTag(name, color) {
    const cleanName = name.trim().toLowerCase()
    if (!cleanName || userTags.length >= 8) return
    if (userTags.some((t) => t.name === cleanName)) {
      addNotification("This tag already exists", "error")
      return
    }
    const {
      data: { user }
    } = await supabase.auth.getUser()
    const { error } = await apiRequest(
      supabase
        .from("tags")
        .insert([{ name: cleanName, color: color, user_id: user.id }])
    )
    if (error) {
      addNotification("Failed to create tag: " + error.message, "error")
    } else {
      addNotification("Tag created successfully", "success")
      await refreshTags()
    }
  }

  async function toggleComplete() {
    await apiRequest(
      supabase
        .from("tasks")
        .update({ completed: !task.completed })
        .eq("id", task.id)
    )
    refresh()
  }

  async function deleteTask() {
    if (!window.confirm("Delete this task?")) return
    const { error } = await apiRequest(
      supabase.from("tasks").delete().eq("id", task.id)
    )
    if (error) {
      addNotification("Failed to delete task: " + error.message, "error")
    } else {
      addNotification("Task deleted successfully", "success")
      refresh()
    }
  }

  const tagColors = userTags.reduce((acc, t) => {
    acc[t.name.toLowerCase()] = t.color
    return acc
  }, {})

  return (
    <>
      <div
        className={`task ${task.completed ? "done" : ""}`}
        ref={setNodeRef}
        style={style}>
        <div className="drag-handle" {...attributes} {...listeners}>
          ⋮⋮
        </div>
        <div className="tag-indicators">
          {task.tags
            ?.split(",")
            .filter((t) => t.trim())
            .map((tag) => (
              <div
                key={tag}
                className="tag-bar"
                style={{
                  background: tagColors[tag.trim().toLowerCase()] || "#334155"
                }}
              />
            ))}
        </div>
        <div className="task-content">
          <span onClick={() => setShowModal(true)}>{task.title}</span>
        </div>
        <div className="task-controls">
          <button
            className="complete-btn"
            onClick={(e) => {
              e.stopPropagation()
              toggleComplete()
            }}>
            {task.completed ? "↩" : "✓"}
          </button>
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation()
              deleteTask()
            }}>
            ✕
          </button>
        </div>
      </div>

      {showModal && (
        <TaskModal
          task={task}
          refresh={refresh}
          userTags={userTags}
          onCreateTag={createTag}
          onDeleteTag={deleteTag}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
