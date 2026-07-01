"use client"

import { useRef, useCallback } from "react"

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

const SWIPE_THRESHOLD = 50

export function useSwipe(
  handlers: SwipeHandlers,
  deps: React.DependencyList = []
) {
  const startX = useRef(0)
  const startY = useRef(0)
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
  }, [])

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const dx = endX - startX.current
      const dy = endY - startY.current

      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          if (dx > 0) handlersRef.current.onSwipeRight?.()
          else handlersRef.current.onSwipeLeft?.()
        }
      } else {
        if (Math.abs(dy) > SWIPE_THRESHOLD) {
          if (dy > 0) handlersRef.current.onSwipeDown?.()
          else handlersRef.current.onSwipeUp?.()
        }
      }
    },
    deps // eslint-disable-line react-hooks/exhaustive-deps
  )

  return { onTouchStart, onTouchEnd }
}
