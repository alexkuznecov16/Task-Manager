import { useState } from "react"
import { apiRequest, supabase } from "../supabase"

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false) // toggle
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const handleGoogleAuth = async () => {
    const { error } = await apiRequest(
      supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin
        }
      })
    )

    if (error) alert(error.message)
  }

  const handleDiscordAuth = async () => {
    const { error } = await apiRequest(
      supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: window.location.origin
        }
      })
    )

    if (error) alert(error.message)
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (isSignUp) {
      // Sing Up
      const { error } = await apiRequest(
        supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name } }
        })
      )
      if (error) alert(error.message)
      else alert("Registration successful! Please check your email.")
    } else {
      // Login
      const { error } = await apiRequest(
        supabase.auth.signInWithPassword({
          email,
          password
        })
      )
      if (error) alert(error.message)
    }
    setLoading(false)
  }

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <form onSubmit={handleAuth} className="auth-form">
          <h2>{isSignUp ? "Create an account" : "Welcome back!"}</h2>

          {isSignUp && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="main-btn" disabled={loading}>
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign in"}
          </button>

          <p className="toggle-auth">
            {isSignUp ? "Already have an account?" : "New here?"}
            <span onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? " Login" : " Create an account"}
            </span>
          </p>

          <div className="auth-security-note">
            <svg
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 0L0 2.625V6.125C0 9.75625 2.555 13.1425 6 14C9.445 13.1425 12 9.75625 12 6.125V2.625L6 0Z"
                fill="#3eaf7c"
                fillOpacity="0.5"
              />
            </svg>
            <span>All your data is encrypted and secured by Supabase DB</span>
          </div>
          <div className="socials_auth_container">
            <div className="google-auth-card" onClick={handleGoogleAuth}>
              <svg
                className="google-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="18"
                height="18">
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.9 32.7 29.4 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.7 6 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.5 0 19-7.6 19-20 0-1.3-.1-2.7-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.6 16.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.7 6 29.1 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.3 0 10.1-2 13.6-5.3l-6.3-5.2C29.2 35.1 26.7 36 24 36c-5.4 0-9.9-3.3-11.5-8l-6.5 5C9.5 39.3 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1 3-3.2 5.4-6 6.8l6.3 5.2C39.8 36.7 43 30.9 43 24c0-1.3-.1-2.7-.4-3.5z"
                />
              </svg>
              <span>Google</span>
            </div>
            <div className="discord-auth-card" onClick={handleDiscordAuth}>
              <svg
                className="discord-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor">
                <path d="M20.317 4.369A19.791 19.791 0 0016.885 3c-.16.29-.343.68-.47.986a18.27 18.27 0 00-4.83 0 9.728 9.728 0 00-.475-.986 19.736 19.736 0 00-3.436 1.373C4.533 8.045 3.76 11.61 4.147 15.122a19.923 19.923 0 006.077 3.073c.492-.672.93-1.38 1.305-2.126a12.956 12.956 0 01-2.047-.977c.173-.128.342-.261.504-.401 3.947 1.84 8.227 1.84 12.13 0 .163.14.332.273.504.401a12.92 12.92 0 01-2.051.977c.375.746.813 1.454 1.305 2.126a19.875 19.875 0 006.08-3.073c.457-4.068-.78-7.6-3.637-10.753zM9.845 13.118c-.927 0-1.69-.852-1.69-1.902s.75-1.903 1.69-1.903c.948 0 1.706.853 1.69 1.903 0 1.05-.75 1.902-1.69 1.902zm4.31 0c-.927 0-1.69-.852-1.69-1.902s.75-1.903 1.69-1.903c.948 0 1.706.853 1.69 1.903 0 1.05-.742 1.902-1.69 1.902z" />
              </svg>
              <span>Discord</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
