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
      ? "font-amiri"
      : arabicFont === "simple"
      ? "font-scheherazade"
      : arabicFont === "indopak"
      ? "font-arabic-indopak"
      : "font-arabic-nastaleeq"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative rounded-xl border border-islamic-green/10 bg-card/60 backdrop-blur-sm p-4 md:p-6 transition-all",
        "hover:border-islamic-green/30 hover:bg-card/80 hover:shadow-md",
        "surah-card-glow",
        isBookmarked && "border-islamic-gold/50 bg-islamic-gold/5",
        isFavorited && "border-islamic-green/50 bg-islamic-green/5",
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
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-islamic-green/10 to-islamic-gold/10 text-xs font-semibold text-islamic-green border border-islamic-green/20"
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
              "text-right leading-relaxed text-islamic-green-dark dark:text-islamic-green/90",
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
              className="text-sm leading-relaxed text-muted-foreground border-t border-islamic-green/10 pt-3"
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
