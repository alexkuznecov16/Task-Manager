import { createPortal } from "react-dom"
import { useState } from "react"
import { useBoard } from "../context/BoardContext"
import { useNotification } from "../hooks/useNotification"

export default function TaskModal({ task, userTags, onDeleteTag, onClose }) {
  const addNotification = useNotification()
  const { updateTask, createTag } = useBoard()
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || "")
  const [deadline, setDeadline] = useState(
    task.deadline ? task.deadline.substring(0, 16) : ""
  )
  const [tags, setTags] = useState(
    task.tags ? task.tags.split(",").filter((t) => t !== "") : []
  )
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#3b82f6")

  function toggleTag(tag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  async function save() {
    let isoDeadline = null
    if (deadline) {
      const d = new Date(deadline)
      if (isNaN(d)) {
        alert("Invalid date")
        return
      }
      isoDeadline = d.toISOString()
    }

    const updates = {
      title: title.trim(),
      description,
      deadline: isoDeadline,
      tags: tags.length > 0 ? tags.join(",") : null
    }

    await updateTask(task.id, updates)
    onClose()
  }

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit task</h2>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="datetime-local"
          value={deadline || ""}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <div className="tags-section">
          <label>Tags ({userTags.length}/8):</label>
          <div
            className="tags-list"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              margin: "10px 0"
            }}>
            {userTags.map((tag) => (
              <div
                key={tag.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  background: tags.includes(tag.name)
                    ? tag.color
                    : "transparent",
                  border: `2px solid ${tag.color}`,
                  borderRadius: "6px",
                  padding: "2px 8px"
                }}>
                <span
                  onClick={() => toggleTag(tag.name)}
                  style={{
                    cursor: "pointer",
                    fontSize: "14px",
                    color: tags.includes(tag.name) ? "#fff" : tag.color,
                    fontWeight: "500"
                  }}>
                  #{tag.name}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteTag(tag.id)
                    setTags((prev) => prev.filter((t) => t !== tag.name))
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: tags.includes(tag.name) ? "#fff" : "#ef4444",
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "0 2px",
                    lineHeight: 1
                  }}>
                  ×
                </button>
              </div>
            ))}
          </div>

          {userTags.length < 8 && (
            <div
              className="add-tag-form"
              style={{ display: "flex", gap: "8px", marginTop: "15px" }}>
              <input
                style={{ flex: 1, margin: 0 }}
                placeholder="New tag name..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
              <input
                type="color"
                style={{
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                  border: "none",
                  background: "none"
                }}
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
              />
              <button
                type="button"
                onClick={async () => {
                  const name = newTagName.trim().toLowerCase()
                  if (!name || tags.length >= 8) return
                  try {
                    // eslint-disable-next-line no-unused-vars
                    const { id, color } = await createTag(name, newTagColor)

                    setTags((prev) => [...prev, name])
                    setNewTagName("")
                  } catch (err) {
                    addNotification(
                      "Failed to create tag:" + err.message,
                      "error"
                    )
                  }
                }}>
                +
              </button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button onClick={onClose} className="cancel-btn-colors">
            Cancel
          </button>
          <button onClick={save} className="save-btn-colors">
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
