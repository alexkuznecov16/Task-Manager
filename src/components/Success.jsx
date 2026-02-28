export default function Success({ text, onClose }) {
  return (
    <div className="notification-block success">
      <div className="notification-content">
        <span>{text}</span>
        <button onClick={onClose}>×</button>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar" />
      </div>
    </div>
  )
}
