"use client"

import { useState, useRef, memo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { AyahActions } from "./AyahActions"
import { WordByWord } from "./WordByWord"
import { PlayButton } from "@/components/audio/PlayButton"
import { useReaderStore } from "@/store/readerStore"
import { useHighlightStore } from "@/store/highlightStore"
import type { Ayah, Translation, WordByWord as WordByWordType } from "@/types"

interface AyahCardProps {
  ayah: Ayah
  surahName?: string
  translation?: Translation
  words?: WordByWordType[]
  isBookmarked: boolean
  isFavorited: boolean
  onToggleBookmark: () => void
  onToggleFavorite: () => void
  onHighlight: (color: string) => void
  onNote: () => void
  audioUrl?: string
}

export const AyahCard = memo(function AyahCard({
  ayah,
  surahName,
  translation,
  words,
  isBookmarked,
  isFavorited,
  onToggleBookmark,
  onToggleFavorite,
  onHighlight,
  onNote,
  audioUrl,
}: AyahCardProps) {
  const { fontSize, arabicFont, translationLanguage, showWordByWord, showVerseNumber } =
    useReaderStore()
  const highlight = useHighlightStore((s) =>
    s.isHighlighted(ayah.surahNumber, ayah.ayahNumber)
  )
  const [showActions, setShowActions] = useState(false)
  const ayahRef = useRef<HTMLDivElement>(null)

  const arabicFontClass =
    arabicFont === "uthmani"
      ? "font-arabic"
      : arabicFont === "simple"
      ? "font-arabic-simple"
      : arabicFont === "indopak"
      ? "font-arabic-indopak"
      : "font-arabic-nastaleeq"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative rounded-lg border p-4 md:p-6 transition-all",
        "hover:border-primary/30 hover:shadow-sm",
        isBookmarked && "border-yellow-400/50 bg-yellow-50/30 dark:bg-yellow-950/10",
        isFavorited && "border-pink-400/50 bg-pink-50/30 dark:bg-pink-950/10",
        highlight && "border-transparent"
      )}
      style={
        highlight
          ? { backgroundColor: highlight.color, borderColor: highlight.color }
          : undefined
      }
      ref={ayahRef}
      role="article"
      aria-label={`Verse ${ayah.ayahNumber} of Surah ${surahName || ayah.surahNumber}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col items-center gap-2 shrink-0">
          {showVerseNumber && (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
              aria-label={`Verse number ${ayah.ayahNumber}`}
            >
              {ayah.ayahNumber}
            </div>
          )}
          <PlayButton
            surahNumber={ayah.surahNumber}
            ayahNumber={ayah.ayahNumber}
            surahName={surahName || `Surah ${ayah.surahNumber}`}
            audioUrl={audioUrl || `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${String(ayah.surahNumber).padStart(3, "0")}.mp3`}
          />
        </div>

        <div className="flex-1 space-y-3">
          <div
            className={cn(
              "text-right leading-relaxed",
              arabicFontClass
            )}
            style={{ fontSize: `${fontSize}px` }}
            dir="rtl"
          >
            {ayah.textArabic}
          </div>

          {showWordByWord && words && words.length > 0 && (
            <WordByWord words={words} />
          )}

          {translationLanguage !== "off" && translation && (
            <div
              className="text-sm leading-relaxed text-muted-foreground border-t pt-3"
              style={{ fontSize: `${Math.max(14, fontSize - 6)}px` }}
            >
              {translation.text}
            </div>
          )}
        </div>
      </div>

      <AyahActions
        visible={showActions}
        ayah={ayah}
        isBookmarked={isBookmarked}
        isFavorited={isFavorited}
        onToggleBookmark={onToggleBookmark}
        onToggleFavorite={onToggleFavorite}
        onHighlight={onHighlight}
        onNote={onNote}
      />
    </motion.div>
  )
})
