import { create } from "zustand"
import { persist } from "zustand/middleware"

export type TranslationLanguage = "en" | "ur" | "off"
export type ArabicFont = "uthmani" | "simple" | "indopak" | "nastaleeq"

interface ReaderState {
  fontSize: number
  arabicFont: ArabicFont
  translationLanguage: TranslationLanguage
  showWordByWord: boolean
  showVerseNumber: boolean
  setFontSize: (size: number) => void
  setArabicFont: (font: ArabicFont) => void
  setTranslationLanguage: (lang: TranslationLanguage) => void
  setShowWordByWord: (show: boolean) => void
  setShowVerseNumber: (show: boolean) => void
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      fontSize: 24,
      arabicFont: "uthmani",
      translationLanguage: "en",
      showWordByWord: false,
      showVerseNumber: true,
      setFontSize: (fontSize) => set({ fontSize }),
      setArabicFont: (arabicFont) => set({ arabicFont }),
      setTranslationLanguage: (translationLanguage) => set({ translationLanguage }),
      setShowWordByWord: (showWordByWord) => set({ showWordByWord }),
      setShowVerseNumber: (showVerseNumber) => set({ showVerseNumber }),
    }),
    { name: "quran-reader-settings" }
  )
)
