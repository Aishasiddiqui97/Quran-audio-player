"use client"

import { useRef, useCallback, useState } from "react"
import { Play, Pause, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAudioPlayerStore } from "@/store/audioPlayerStore"

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
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [localPlaying, setLocalPlaying] = useState(false)
  const [localLoading, setLocalLoading] = useState(false)
  const { currentTrack, isPlaying, isLoading, setTrack, togglePlay } =
    useAudioPlayerStore()

  const isCurrentTrack =
    currentTrack?.surahNumber === surahNumber &&
    currentTrack?.ayahNumber === ayahNumber

  const handlePlay = useCallback(() => {
    if (isCurrentTrack) {
      togglePlay()
      return
    }

    if (!audioUrl) return

    const track = { surahNumber, ayahNumber, surahName, audioUrl }
    setTrack(track)

    const audio = audioRef.current
    if (audio) {
      setLocalLoading(true)
      audio.src = audioUrl
      audio.volume = 0.8

      const onCanPlay = () => {
        audio.removeEventListener("canplay", onCanPlay)
        audio.play().then(() => {
          setLocalPlaying(true)
          setLocalLoading(false)
        }).catch(() => {
          setLocalPlaying(false)
          setLocalLoading(false)
        })
      }
      audio.addEventListener("canplay", onCanPlay)
    }
  }, [isCurrentTrack, togglePlay, audioUrl, surahNumber, ayahNumber, surahName, setTrack])

  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4"

  return (
    <>
      <audio
        ref={audioRef}
        preload="none"
        onEnded={() => setLocalPlaying(false)}
      />
      <Button
        variant={isCurrentTrack && isPlaying ? "default" : "outline"}
        size={size}
        className={`shrink-0 ${size === "sm" ? "h-7 w-7" : ""}`}
        onClick={handlePlay}
        disabled={!audioUrl}
        aria-label={
          !audioUrl
            ? "Audio unavailable"
            : isCurrentTrack && isPlaying
            ? `Pause ${surahName} verse ${ayahNumber}`
            : `Play ${surahName} verse ${ayahNumber}`
        }
      >
        {(isLoading && isCurrentTrack) || localLoading ? (
          <Loader2 className={`${iconSize} animate-spin`} />
        ) : isCurrentTrack && isPlaying ? (
          <Pause className={iconSize} />
        ) : (
          <Play className={iconSize} />
        )}
      </Button>
    </>
  )
}
