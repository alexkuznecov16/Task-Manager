import { createPortal } from "react-dom"
import { useState } from "react"
import { apiRequest, supabase } from "../supabase"

const TAGS = [
  { name: "work", color: "#3b82f6" },
  { name: "home", color: "#22c55e" },
  { name: "urgent", color: "#ef4444" },
  { name: "money", color: "#eab308" },
  { name: "personal", color: "#ec4899" },
  { name: "waiting", color: "#a855f7" },
  { name: "review", color: "#f97316" }
]

export default function TaskModal({
  task,
  refresh,
  onClose,
  userTags,
  onCreateTag,
  onDeleteTag
}) {
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
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag))
    } else {
      setTags([...tags, tag])
    }
  }

  async function handleAddNewTag() {
    const name = newTagName.trim().toLowerCase()
    if (!name) return

    await onCreateTag(name, newTagColor)
    setNewTagName("")
  }

  async function save() {
    if (!task.id) return

    const formattedDeadline = deadline ? new Date(deadline).toISOString() : null

    const tagsString = tags.length > 0 ? tags.join(",") : null

    const { error } = await apiRequest(
      supabase
        .from("tasks")
        .update({
          title: title.trim(),
          description: description,
          deadline: formattedDeadline,
          tags: tagsString
        })
        .eq("id", task.id)
    )

    if (error) {
      console.error("Where is the error::", error.message)
      alert("DB error: : " + error.message)
      return
    }

    refresh()
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
                    if (
                      window.confirm(`Delete tag #${tag.name} from database?`)
                    ) {
                      onDeleteTag(tag.id)
                    }
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
              <button type="button" onClick={handleAddNewTag}>
                +
              </button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button onClick={save}>Save Changes</button>
          <button
            onClick={onClose}
            style={{ background: "#ef4444", color: "#fff" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
