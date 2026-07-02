"use client"

import { useCallback } from "react"
import { Play, Pause, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAudioPlayerStore } from "@/store/audioPlayerStore"
import { cn } from "@/lib/utils"

interface PlayButtonProps {
  surahNumber: number
  ayahNumber: number
  surahName: string
  audioUrl?: string
  size?: "sm" | "default" | "icon"
}

export function PlayButton({
  surahNumber,
  ayahNumber,
  surahName,
  audioUrl,
  size = "icon",
}: PlayButtonProps) {
  const { currentTrack, isPlaying, isLoading, setTrack, togglePlay } =
    useAudioPlayerStore()

  const isCurrentTrack =
    currentTrack?.surahNumber === surahNumber &&
    currentTrack?.ayahNumber === ayahNumber

  const handlePlay = useCallback(() => {
    if (!audioUrl) return

    if (isCurrentTrack) {
      togglePlay()
      return
    }

    const track = { surahNumber, ayahNumber, surahName, audioUrl }
    setTrack(track)
  }, [isCurrentTrack, togglePlay, audioUrl, surahNumber, ayahNumber, surahName, setTrack])

  const isActive = isCurrentTrack && isPlaying
  const showLoading = isLoading && isCurrentTrack

  return (
    <Button
      variant="ghost"
      size={size}
      className={cn(
        "shrink-0 rounded-full transition-all",
        size === "sm" ? "h-8 w-8" : "h-9 w-9",
        isActive
          ? "bg-islamic-gold text-white hover:bg-islamic-gold-dark shadow-sm animate-gold-glow"
          : "bg-islamic-green/10 text-islamic-green hover:bg-islamic-green hover:text-white"
      )}
      onClick={handlePlay}
      disabled={!audioUrl}
      aria-label={
        !audioUrl
          ? "Audio unavailable"
          : isActive
          ? `Pause ${surahName} verse ${ayahNumber}`
          : `Play ${surahName} verse ${ayahNumber}`
      }
    >
      {showLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-islamic-spin" />
      ) : isActive ? (
        <Pause className="h-3.5 w-3.5 fill-current" />
      ) : (
        <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
      )}
    </Button>
  )
}
