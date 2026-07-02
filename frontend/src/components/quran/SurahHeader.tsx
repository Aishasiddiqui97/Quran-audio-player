"use client"

import { motion } from "framer-motion"
import { Book, MapPin, ArrowLeft, Play } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Surah } from "@/types"
import { useAudioPlayerStore } from "@/store/audioPlayerStore"
import { cn } from "@/lib/utils"

interface SurahHeaderProps {
  surah: Surah
}

export function SurahHeader({ surah }: SurahHeaderProps) {
  const { currentTrack, isPlaying, setTrack, togglePlay } = useAudioPlayerStore()

  const pad = (n: number) => String(n).padStart(3, "0")
  const audioUrl = `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${pad(surah.surahNumber)}.mp3`

  const isCurrentTrack =
    currentTrack?.surahNumber === surah.surahNumber && currentTrack?.ayahNumber === 1

  const handlePlaySurah = () => {
    if (isCurrentTrack) {
      togglePlay()
    } else {
      setTrack({
        surahNumber: surah.surahNumber,
        ayahNumber: 1,
        surahName: surah.nameSimple || surah.nameArabic,
        audioUrl,
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-islamic-green/20 bg-gradient-to-br from-islamic-green/10 via-islamic-cream/50 to-islamic-gold/10 p-6 md:p-8"
    >
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #0B6B3A 0%, transparent 50%),
            repeating-linear-gradient(45deg, transparent, transparent 30px, #0B6B3A 30px, #0B6B3A 31px),
            repeating-linear-gradient(-45deg, transparent, transparent 30px, #C8A24A 30px, #C8A24A 31px)`
        }}
      />
      <Link
        href="/surahs"
        className="relative mb-4 inline-flex items-center gap-1 text-sm text-islamic-green hover:text-islamic-green-dark transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Surahs
      </Link>

      <div className="relative flex flex-col items-center text-center space-y-4">
        <div className={cn(
          "flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg",
          "bg-gradient-to-br from-islamic-green to-islamic-green-dark"
        )}>
          <span className="text-3xl font-bold text-white font-poppins">
            {surah.surahNumber}
          </span>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-amiri text-islamic-green-dark dark:text-islamic-green" dir="rtl">
            {surah.nameArabic}
          </h1>
          <h2 className="text-xl font-semibold text-foreground mt-1 font-poppins">
            {surah.nameSimple}
          </h2>
          <p className="text-sm text-muted-foreground italic">
            {surah.nameEnglish}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-islamic-gold" />
            {surah.revelationType}
          </span>
          <span className="flex items-center gap-1.5">
            <Book className="h-4 w-4 text-islamic-gold" />
            {surah.totalAyahs} verses
          </span>
        </div>
        <Button
          className={cn(
            "gap-2 rounded-full px-6 shadow-md transition-all",
            "bg-gradient-to-r from-islamic-green to-islamic-green-dark",
            "hover:from-islamic-green-dark hover:to-islamic-green",
            "hover:shadow-lg active:scale-95"
          )}
          onClick={handlePlaySurah}
        >
          {isCurrentTrack && isPlaying ? (
            <>
              <div className="wave-bars">
                <span className="bg-white" /><span className="bg-white" /><span className="bg-white" /><span className="bg-white" /><span className="bg-white" />
              </div>
              Pausing...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-white" />
              Play Full Surah
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}
