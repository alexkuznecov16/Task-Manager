import { createContext, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import Error from "../components/Error"
import Success from "../components/Success"

export const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const addNotification = useCallback(
    (text, type) => {
      const id = Date.now()
      setNotifications((prev) => [...prev, { id, text, type }])
      setTimeout(() => removeNotification(id), 5000)
    },
    [removeNotification]
  )

  return (
    <NotificationContext.Provider value={addNotification}>
      {children}
      {createPortal(
        <div className="global-notification-container">
          {notifications.map((n) =>
            n.type === "error" ? (
              <Error
                key={n.id}
                text={n.text}
                onClose={() => removeNotification(n.id)}
              />
            ) : (
              <Success
                key={n.id}
                text={n.text}
                onClose={() => removeNotification(n.id)}
              />
            )
          )}
        </div>,
        document.body
      )}
    </NotificationContext.Provider>
  )
}
