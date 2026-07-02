"use client"

import { memo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Book, MapPin, Play, Star } from "lucide-react"
import type { Surah } from "@/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { RippleButton } from "@/components/ui/RippleButton"
import { useAudioPlayerStore } from "@/store/audioPlayerStore"

interface SurahCardProps {
  surah: Surah
  index: number
  viewMode?: "grid" | "list"
}

const POPULAR_SURAH_NUMBERS = [1, 18, 36, 55, 67, 112, 113, 114]

export const SurahCard = memo(function SurahCard({ surah, index, viewMode = "list" }: SurahCardProps) {
  const { currentTrack, isPlaying, setTrack, togglePlay } = useAudioPlayerStore()

  const isCurrentTrack =
    currentTrack?.surahNumber === surah.surahNumber && currentTrack?.ayahNumber === 1

  const isPopular = POPULAR_SURAH_NUMBERS.includes(surah.surahNumber)

  const pad = (n: number) => String(n).padStart(3, "0")
  const audioUrl = `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${pad(surah.surahNumber)}.mp3`

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isCurrentTrack) {
      togglePlay()
    } else {
      setTrack({
        surahNumber: surah.surahNumber,
        ayahNumber: 1,
        surahName: surah.nameSimple || surah.nameArabic,
        audioUrl,
        reciterName: "Mishary Alafasy",
      })
    }
  }

  if (viewMode === "grid") {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Link
          href={`/surahs/${surah.surahNumber}`}
          className={cn(
            "group relative block rounded-xl border p-5 h-full overflow-hidden transition-all duration-300 glass-card-hover",
            isCurrentTrack
              ? "border-islamic-green/30 surah-active-glow"
              : "border-border/50 hover:border-islamic-green/20"
          )}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-islamic-gold/[0.03] to-transparent rounded-bl-full" />
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-islamic-green/[0.02] to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex flex-col items-center text-center h-full relative z-10">
            <div className="surah-badge">
              <div className={cn(
                "relative flex h-14 w-14 items-center justify-center rounded-2xl mb-4 transition-all duration-300",
                isCurrentTrack
                  ? "bg-gradient-to-br from-islamic-gold to-islamic-gold-dark text-white shadow-lg shadow-islamic-gold/20"
                  : "bg-gradient-to-br from-islamic-green to-islamic-green-dark text-white shadow-md group-hover:shadow-lg group-hover:from-islamic-green-dark group-hover:to-islamic-green"
              )}>
                <span className="text-lg font-bold">{surah.surahNumber}</span>
                <div className={cn(
                  "absolute -top-1 -right-1 w-3 h-3 rounded-full shadow-sm",
                  isCurrentTrack ? "bg-white" : "bg-islamic-gold"
                )} />
              </div>
            </div>
            {isPopular && (
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-2.5 w-2.5 text-islamic-gold fill-islamic-gold" />
                <span className="text-[8px] text-islamic-gold font-medium uppercase tracking-wider">Popular</span>
              </div>
            )}
            <h3 className={cn(
              "font-semibold text-sm truncate w-full transition-colors",
              isCurrentTrack ? "text-islamic-gold" : "group-hover:text-islamic-green"
            )}>
              {surah.nameSimple}
            </h3>
            <p className="text-[10px] text-muted-foreground italic truncate w-full mb-2">
              {surah.nameEnglish}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {surah.revelationType}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Book className="h-3 w-3" />
                {surah.totalAyahs}
              </span>
            </div>
            <span className="text-lg font-amiri leading-relaxed text-islamic-green-dark/70 dark:text-islamic-green/70 mb-3" dir="rtl">
              {surah.nameArabic}
            </span>
            <div className="mt-auto">
              <RippleButton
                variant={isCurrentTrack && isPlaying ? "primary" : "secondary"}
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full !p-0 transition-all shadow-sm",
                  isCurrentTrack && isPlaying
                    ? "bg-islamic-gold hover:bg-islamic-gold-dark !shadow-gold-glow animate-gold-glow"
                    : ""
                )}
                onClick={handlePlay}
                aria-label={`Play ${surah.nameSimple}`}
              >
                {isCurrentTrack && isPlaying ? (
                  <div className="wave-bars">
                    <span className="bg-white" />
                    <span className="bg-white" />
                    <span className="bg-white" />
                    <span className="bg-white" />
                    <span className="bg-white" />
                  </div>
                ) : (
                  <Play className="h-3.5 w-3.5 ml-0.5" />
                )}
              </RippleButton>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link
        href={`/surahs/${surah.surahNumber}`}
          className={cn(
            "group relative block rounded-xl border p-4 overflow-hidden transition-all duration-300 glass-card-hover",
            isCurrentTrack
              ? "border-islamic-green/30 surah-active-glow"
              : "border-border/50 hover:border-islamic-green/20"
          )}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-islamic-gold/[0.02] to-transparent rounded-bl-full pointer-events-none" />
        <div className="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-islamic-green/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="surah-badge">
            <div className={cn(
              "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-300",
              isCurrentTrack
                ? "bg-gradient-to-br from-islamic-gold to-islamic-gold-dark text-white shadow-md shadow-islamic-gold/20"
                : "bg-gradient-to-br from-islamic-green to-islamic-green-dark text-white shadow-md group-hover:shadow-lg group-hover:from-islamic-green-dark group-hover:to-islamic-green"
            )}>
              <span className="text-lg font-bold font-poppins">{surah.surahNumber}</span>
              <div className={cn(
                "absolute -top-1 -right-1 w-3 h-3 rounded-full shadow-sm",
                isCurrentTrack ? "bg-white" : "bg-islamic-gold"
              )} />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className={cn(
                "text-base font-semibold truncate transition-colors font-poppins",
                isCurrentTrack ? "text-islamic-gold" : "group-hover:text-islamic-green"
              )}>
                {surah.nameSimple}
              </h3>
              {isPopular && (
                <span className="shrink-0 text-[8px] text-islamic-gold font-medium uppercase tracking-wider bg-islamic-gold/10 px-1.5 py-0.5 rounded-full">
                  Popular
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground italic truncate">
              {surah.nameEnglish}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-islamic-gold/60" />
                {surah.revelationType}
              </span>
              <span className="flex items-center gap-1">
                <Book className="h-3 w-3 text-islamic-gold/60" />
                {surah.totalAyahs} verses
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="hidden sm:block text-right">
              <span
                className="text-xl font-amiri leading-relaxed text-islamic-green-dark/70 dark:text-islamic-green/70"
                dir="rtl"
              >
                {surah.nameArabic}
              </span>
            </div>
            <RippleButton
              variant={isCurrentTrack && isPlaying ? "primary" : "secondary"}
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full !p-0 transition-all shadow-sm",
                isCurrentTrack && isPlaying
                  ? "bg-islamic-gold hover:bg-islamic-gold-dark !shadow-gold-glow animate-gold-glow"
                  : ""
              )}
              onClick={handlePlay}
              aria-label={`Play ${surah.nameSimple}`}
            >
              {isCurrentTrack && isPlaying ? (
                <div className="wave-bars">
                  <span className="bg-white" />
                  <span className="bg-white" />
                  <span className="bg-white" />
                  <span className="bg-white" />
                  <span className="bg-white" />
                </div>
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </RippleButton>
          </div>
        </div>
      </Link>
    </motion.div>
  )
})
