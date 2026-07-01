import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { VerseNote } from "@/types"

interface NoteState {
  notes: VerseNote[]
  addNote: (surahNumber: number, ayahNumber: number, text: string) => void
  updateNote: (surahNumber: number, ayahNumber: number, text: string) => void
  removeNote: (surahNumber: number, ayahNumber: number) => void
  getNote: (surahNumber: number, ayahNumber: number) => VerseNote | undefined
  getNotesBySurah: (surahNumber: number) => VerseNote[]
  clearNotes: () => void
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: [],
      addNote: (surahNumber, ayahNumber, text) => {
        const existing = get().notes.find(
          (n) => n.surahNumber === surahNumber && n.ayahNumber === ayahNumber
        )
        if (existing) {
          set({
            notes: get().notes.map((n) =>
              n.surahNumber === surahNumber && n.ayahNumber === ayahNumber
                ? { ...n, text, timestamp: Date.now() }
                : n
            ),
          })
        } else {
          set({
            notes: [
              ...get().notes,
              { surahNumber, ayahNumber, text, timestamp: Date.now() },
            ],
          })
        }
      },
      updateNote: (surahNumber, ayahNumber, text) => {
        set({
          notes: get().notes.map((n) =>
            n.surahNumber === surahNumber && n.ayahNumber === ayahNumber
              ? { ...n, text, timestamp: Date.now() }
              : n
          ),
        })
      },
      removeNote: (surahNumber, ayahNumber) => {
        set({
          notes: get().notes.filter(
            (n) => !(n.surahNumber === surahNumber && n.ayahNumber === ayahNumber)
          ),
        })
      },
      getNote: (surahNumber, ayahNumber) => {
        return get().notes.find(
          (n) => n.surahNumber === surahNumber && n.ayahNumber === ayahNumber
        )
      },
      getNotesBySurah: (surahNumber) => {
        return get().notes.filter((n) => n.surahNumber === surahNumber)
      },
      clearNotes: () => set({ notes: [] }),
    }),
    { name: "quran-notes" }
  )
)
