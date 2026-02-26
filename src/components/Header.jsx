import { useEffect, useState } from "react"
import { apiRequest, supabase } from "../supabase"

export default function Header({ user }) {
  const [time, setTime] = useState(new Date())
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const handleLogout = async () => {
    await apiRequest(supabase.auth.signOut())
  }

  const editName = async () => {
    const newName = prompt("Enter new name:", user.user_metadata?.name || "")
    if (newName && newName !== user.user_metadata?.name) {
      const { error } = await apiRequest(
        supabase.auth.updateUser({
          data: { name: newName }
        })
      )
      if (error) alert(error.message)
      else alert("Name updated!")
    }
  }

  const editEmail = async () => {
    const newEmail = prompt("Enter new email:", user.email)
    if (newEmail && newEmail !== user.email) {
      const { error } = await apiRequest(
        supabase.auth.updateUser({ email: newEmail })
      )
      if (error) alert(error.message)
      else alert("Check your new email to confirm change!")
    }
  }

  const formattedDate = time.toLocaleDateString("en-GB")
  const formattedTime = time.toLocaleTimeString("en-GB", {
    hour12: false
  })

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">GetDone App</h1>

        {user && (
          <div className="user-info">
            <div className="user-details">
              <span
                className="user-name"
                onClick={editName}
                style={{ cursor: "pointer" }}
                title="Click to change name">
                {user.user_metadata?.name || "User"}
              </span>
              <span
                className="user-email"
                onClick={editEmail}
                style={{ cursor: "pointer" }}
                title="Click to change email">
                {user.email}
              </span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        )}
      </div>

      <div className="header-right">
        <div className="datetime desktop-only">
          <span>{formattedDate}</span>
          <span>{formattedTime}</span>
        </div>

        <button
          className={`burger-menu ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div className={`mobile-menu ${isMenuOpen ? "active" : ""}`}>
        <button
          className="close-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4 12H20M20 12L14 6M20 12L14 18"
              stroke="url(#arrow-gradient)"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <defs>
              <linearGradient
                id="arrow-gradient"
                x1="4"
                y1="12"
                x2="20"
                y2="12"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="#6366f1" />
                <stop offset="1" stop-color="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </button>
        <div className="mobile-menu-content">
          <div className="mobile-header">
            <h2 className="mobile-header-title">Get Done</h2>
            <img src="/todo.svg" alt="logo" />
          </div>
          <div className="mobile-datetime">
            <p>{formattedDate}</p>
            <p>{formattedTime}</p>
          </div>

          {user && (
            <div className="mobile-user-section">
              <div className="user-card" onClick={editName}>
                <label>Name</label>
                <span>{user.user_metadata?.name || "User"}</span>
              </div>
              <div className="user-card" onClick={editEmail}>
                <label>Email</label>
                <span>{user.email}</span>
              </div>
              <button
                className="logout-btn mobile-logout"
                onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          )}
          <div className="mobile-footer">
            <div className="footer-separator"></div>
            <div className="footer-content">
              <div className="footer-top">
                <span className="badge">Open Source</span>
                <a
                  href="https://github.com/alexkuznecov16/ToDo-App"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-link">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 16 16"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
                  </svg>
                  GitHub Repository
                </a>
              </div>
              <div className="footer-bottom">
                <p>
                  Created by <span>Alexander Kuznecov</span>
                </p>
                <p>
                  © {new Date().getFullYear()} GetDone. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="menu-overlay"
          onClick={() => setIsMenuOpen(!isMenuOpen)}></div>
      </div>
    </header>
  )
}
