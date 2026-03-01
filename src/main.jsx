import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import { NotificationProvider } from "./context/NotificationContext.jsx"
import { BoardProvider } from "./context/BoardContext.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotificationProvider>
      <BoardProvider>
        <App />
      </BoardProvider>
    </NotificationProvider>
  </StrictMode>
)
