import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Highlight } from "@/types"

const HIGHLIGHT_COLORS = [
  "#FEF08A",
  "#FED7AA",
  "#A7F3D0",
  "#BFDBFE",
  "#E9D5FF",
  "#FECDD3",
]

interface HighlightState {
  highlights: Highlight[]
  colors: string[]
  toggleHighlight: (surahNumber: number, ayahNumber: number, color?: string) => void
  removeHighlight: (surahNumber: number, ayahNumber: number) => void
  isHighlighted: (surahNumber: number, ayahNumber: number) => Highlight | undefined
  getHighlightsBySurah: (surahNumber: number) => Highlight[]
  clearHighlights: () => void
}

export const useHighlightStore = create<HighlightState>()(
  persist(
    (set, get) => ({
      highlights: [],
      colors: HIGHLIGHT_COLORS,
      toggleHighlight: (surahNumber, ayahNumber, color) => {
        const existing = get().highlights.find(
          (h) => h.surahNumber === surahNumber && h.ayahNumber === ayahNumber
        )
        if (existing) {
          set({
            highlights: get().highlights.filter(
              (h) => !(h.surahNumber === surahNumber && h.ayahNumber === ayahNumber)
            ),
          })
        } else {
          set({
            highlights: [
              ...get().highlights,
              { surahNumber, ayahNumber, color: color || HIGHLIGHT_COLORS[0], timestamp: Date.now() },
            ],
          })
        }
      },
      removeHighlight: (surahNumber, ayahNumber) => {
        set({
          highlights: get().highlights.filter(
            (h) => !(h.surahNumber === surahNumber && h.ayahNumber === ayahNumber)
          ),
        })
      },
      isHighlighted: (surahNumber, ayahNumber) => {
        return get().highlights.find(
          (h) => h.surahNumber === surahNumber && h.ayahNumber === ayahNumber
        )
      },
      getHighlightsBySurah: (surahNumber) => {
        return get().highlights.filter((h) => h.surahNumber === surahNumber)
      },
      clearHighlights: () => set({ highlights: [] }),
    }),
    {
      name: "quran-highlights",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ highlights: state.highlights }),
    }
  )
)
