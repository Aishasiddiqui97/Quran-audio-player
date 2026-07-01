import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Favorite } from "@/types"

interface FavoriteState {
  favorites: Favorite[]
  toggleFavorite: (surahNumber: number, ayahNumber: number) => void
  isFavorite: (surahNumber: number, ayahNumber: number) => boolean
  getFavoritesBySurah: (surahNumber: number) => Favorite[]
  clearFavorites: () => void
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (surahNumber, ayahNumber) => {
        const exists = get().favorites.some(
          (f) => f.surahNumber === surahNumber && f.ayahNumber === ayahNumber
        )
        if (exists) {
          set({
            favorites: get().favorites.filter(
              (f) => !(f.surahNumber === surahNumber && f.ayahNumber === ayahNumber)
            ),
          })
        } else {
          set({
            favorites: [
              ...get().favorites,
              { surahNumber, ayahNumber, timestamp: Date.now() },
            ],
          })
        }
      },
      isFavorite: (surahNumber, ayahNumber) => {
        return get().favorites.some(
          (f) => f.surahNumber === surahNumber && f.ayahNumber === ayahNumber
        )
      },
      getFavoritesBySurah: (surahNumber) => {
        return get().favorites.filter((f) => f.surahNumber === surahNumber)
      },
      clearFavorites: () => set({ favorites: [] }),
    }),
    { name: "quran-favorites" }
  )
)
