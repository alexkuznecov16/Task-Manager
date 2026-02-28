export default function Error({ text, onClose }) {
  return (
    <div className="notification-block error">
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
