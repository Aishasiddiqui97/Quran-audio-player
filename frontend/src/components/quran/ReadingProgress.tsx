"use client"

import { useEffect, useRef } from "react"
import { useProgressStore } from "@/store/progressStore"

interface ReadingProgressProps {
  surahNumber: number
  totalAyahs: number
  currentAyah: number
}

export function ReadingProgress({
  surahNumber,
  totalAyahs,
  currentAyah,
}: ReadingProgressProps) {
  const { updateProgress } = useProgressStore()
  const hasSaved = useRef(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasSaved.current) {
        updateProgress(surahNumber, currentAyah, totalAyahs)
        hasSaved.current = true
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [surahNumber, currentAyah, totalAyahs, updateProgress])

  const percentage = Math.round((currentAyah / totalAyahs) * 100)

  return (
    <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-1.5">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground shrink-0">
            {percentage}%
          </span>
          <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {currentAyah}/{totalAyahs}
          </span>
        </div>
      </div>
    </div>
  )
}
