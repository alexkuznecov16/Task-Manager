import { useState } from "react"

export default function EditModal({ title, initialValue, onSave, onClose }) {
  const [value, setValue] = useState(initialValue || "")

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-content">
        <h3>Edit {title}</h3>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="edit-modal-actions">
          <button onClick={onClose} className="cancel-btn cancel-btn-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave(value)}
            className="save-btn save-btn-colors"
            disabled={!value.trim()}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
