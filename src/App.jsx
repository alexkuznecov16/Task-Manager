import { useState, useEffect, useRef } from "react"
import { supabase } from "./supabase"
import Board from "./components/Board"
import Header from "./components/Header"
import Auth from "./components/Auth"
import "./styles.css"
import useScrollOnDrag from "react-scroll-ondrag"

function App() {
  const [session, setSession] = useState(null)
  const wrapperRef = useRef(null)
  const { events } = useScrollOnDrag(wrapperRef)

  useEffect(() => {
    // 1. Проверяем сессию при загрузке страницы
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // 2. Подписываемся на изменения (вход/выход)
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="layout">
      <Header user={session?.user} />

      {!session ? (
        <Auth />
      ) : (
        <div {...events} ref={wrapperRef} className="board-wrapper">
          <Board />
        </div>
      )}
    </div>
  )
}

export default App
