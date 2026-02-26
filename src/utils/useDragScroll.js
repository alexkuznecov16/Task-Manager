import { useRef, useEffect, useState } from "react"

const useDragCarousel = () => {
  const ref = useRef(null)
  const [isDown, setIsDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollX, setScrollX] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const containerWidth = el.parentElement.offsetWidth
    const contentWidth = el.scrollWidth

    const mouseDown = (e) => {
      setIsDown(true)
      setStartX(e.pageX)
      setScrollX(getTranslateX(el))
      el.style.cursor = "grabbing"
    }

    const mouseUp = () => {
      setIsDown(false)
      el.style.cursor = "grab"
    }

    const mouseLeave = mouseUp

    const mouseMove = (e) => {
      if (!isDown) return
      e.preventDefault()
      const walk = e.pageX - startX
      let nextX = scrollX + walk

      const maxTranslate = 0
      const minTranslate = Math.min(containerWidth - contentWidth, 0)

      if (nextX > maxTranslate) nextX = maxTranslate
      if (nextX < minTranslate) nextX = minTranslate

      el.style.transform = `translateX(${nextX}px)`
    }

    el.addEventListener("mousedown", mouseDown)
    el.addEventListener("mouseup", mouseUp)
    el.addEventListener("mouseleave", mouseLeave)
    el.addEventListener("mousemove", mouseMove)

    return () => {
      el.removeEventListener("mousedown", mouseDown)
      el.removeEventListener("mouseup", mouseUp)
      el.removeEventListener("mouseleave", mouseLeave)
      el.removeEventListener("mousemove", mouseMove)
    }
  }, [isDown, startX, scrollX])

  return ref
}

const getTranslateX = (el) => {
  const style = window.getComputedStyle(el)
  // eslint-disable-next-line no-undef
  const matrix = new WebKitCSSMatrix(style.transform)
  return matrix.m41
}

export default useDragCarousel
