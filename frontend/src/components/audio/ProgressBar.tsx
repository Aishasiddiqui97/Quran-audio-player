"use client"

import { useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  className?: string
}

export function ProgressBar({
  currentTime,
  duration,
  onSeek,
  className,
}: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null)
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return "0:00"
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const handleSeek = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!barRef.current || !duration) return
      const rect = barRef.current.getBoundingClientRect()
      const x = "touches" in e ? e.touches[0].clientX : e.clientX
      const percent = Math.max(0, Math.min(1, (x - rect.left) / rect.width))
      onSeek(percent * duration)
    },
    [duration, onSeek]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!duration) return
      const step = duration / 100
      let newTime = currentTime
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          newTime = Math.min(duration, currentTime + step * 5)
          break
        case "ArrowLeft":
        case "ArrowDown":
          newTime = Math.max(0, currentTime - step * 5)
          break
        case "Home":
          newTime = 0
          break
        case "End":
          newTime = duration
          break
        default:
          return
      }
      e.preventDefault()
      onSeek(newTime)
    },
    [duration, currentTime, onSeek]
  )

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs tabular-nums text-muted-foreground w-10 text-right">
        {formatTime(currentTime)}
      </span>
      <div
        ref={barRef}
        role="slider"
        tabIndex={0}
        aria-label="Audio progress"
        aria-valuenow={Math.floor(currentTime)}
        aria-valuemin={0}
        aria-valuemax={Math.floor(duration)}
        aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        className="relative flex-1 h-2 cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        onMouseDown={handleSeek}
        onTouchStart={handleSeek}
        onKeyDown={handleKeyDown}
      >
        <div className="absolute inset-0 rounded-full bg-islamic-green/10" />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-islamic-green to-islamic-green-dark transition-all duration-100"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-islamic-gold opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity shadow-md border-2 border-white"
          style={{ left: `calc(${Math.min(100, progress)}% - 8px)` }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground w-10">
        {formatTime(duration)}
      </span>
    </div>
  )
}
