import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ReadingProgress } from "@/types"

interface ProgressState {
  progress: ReadingProgress[]
  updateProgress: (surahNumber: number, ayahNumber: number, totalAyahs: number) => void
  getProgress: (surahNumber: number) => ReadingProgress | undefined
  getLastRead: () => ReadingProgress | undefined
  getContinueReading: () => { surahNumber: number; ayahNumber: number } | null
  clearProgress: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: [],
      updateProgress: (surahNumber, ayahNumber, totalAyahs) => {
        const percentage = Math.round((ayahNumber / totalAyahs) * 100)
        const existing = get().progress.findIndex((p) => p.surahNumber === surahNumber)
        const entry: ReadingProgress = {
          surahNumber,
          ayahNumber,
          timestamp: Date.now(),
          percentage,
        }
        if (existing >= 0) {
          const updated = [...get().progress]
          updated[existing] = entry
          set({ progress: updated })
        } else {
          set({ progress: [...get().progress, entry] })
        }
      },
      getProgress: (surahNumber) => {
        return get().progress.find((p) => p.surahNumber === surahNumber)
      },
      getLastRead: () => {
        const sorted = [...get().progress].sort((a, b) => b.timestamp - a.timestamp)
        return sorted[0]
      },
      getContinueReading: () => {
        const last = get().getLastRead()
        if (!last) return null
        return { surahNumber: last.surahNumber, ayahNumber: last.ayahNumber }
      },
      clearProgress: () => set({ progress: [] }),
    }),
    { name: "quran-progress" }
  )
)
