import TaskModal from "./TaskModal"
import { useState } from "react"
import { apiRequest, supabase } from "../supabase"

export default function Task({ task, refresh, userTags, refreshTags }) {
  const [showModal, setShowModal] = useState(false)

  async function deleteTag(tagId) {
    const { error } = await apiRequest(
      supabase.from("tags").delete().eq("id", tagId)
    )
    if (!error) {
      await refreshTags()
    }
  }

  async function createTag(name, color) {
    const cleanName = name.trim().toLowerCase()
    if (!cleanName || userTags.length >= 8) return

    if (userTags.some((t) => t.name === cleanName)) {
      alert("This tag has already been created")
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

    if (!error) {
      await refreshTags()
    } else {
      alert("Error: " + error.message)
    }
  }

  const tagColors = userTags.reduce((acc, t) => {
    acc[t.name.toLowerCase()] = t.color
    return acc
  }, {})

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
    await apiRequest(supabase.from("tasks").delete().eq("id", task.id))
    refresh()
  }

  return (
    <>
      <div className={`task ${task.completed ? "done" : ""}`}>
        <div className="tag-indicators">
          {task.tags
            ?.split(",")
            .filter((tag) => tag.trim() !== "")
            .map((tag) => {
              const normalizedTag = tag.trim().toLowerCase()
              return (
                <div
                  key={tag}
                  className="tag-bar"
                  style={{
                    background: tagColors[normalizedTag] || "#334155"
                  }}
                />
              )
            })}
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
