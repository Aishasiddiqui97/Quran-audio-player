"use client"

import { useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronDown,
  ChevronUp,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "./ProgressBar"
import { SpeedControl } from "./SpeedControl"
import { useAudioPlayerStore } from "@/store/audioPlayerStore"
import { cn } from "@/lib/utils"

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isReadyRef = useRef(false)
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackSpeed,
    repeatMode,
    isExpanded,
    isLoading,
    setPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    setRepeatMode,
    setExpanded,
    setLoading,
    playNext,
    playPrevious,
    seekTo,
    togglePlay,
    clearQueue,
  } = useAudioPlayerStore()

  const handleEnded = useCallback(() => {
    playNext()
  }, [playNext])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => setDuration(audio.duration || 0)
    const onLoadStart = () => { isReadyRef.current = false; setLoading(true) }
    const onCanPlay = () => { isReadyRef.current = true; setLoading(false) }
    const onEnded = () => handleEnded()
    const onError = () => { isReadyRef.current = false; setLoading(false) }

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("durationchange", onDurationChange)
    audio.addEventListener("loadstart", onLoadStart)
    audio.addEventListener("canplay", onCanPlay)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("error", onError)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("durationchange", onDurationChange)
      audio.removeEventListener("loadstart", onLoadStart)
      audio.removeEventListener("canplay", onCanPlay)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("error", onError)
    }
  }, [setCurrentTime, setDuration, setLoading, handleEnded])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    isReadyRef.current = false
    setLoading(true)
    audio.src = currentTrack.audioUrl
    audio.volume = volume
    audio.playbackRate = playbackSpeed
  }, [currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    audio.volume = volume
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.playbackRate = playbackSpeed
  }, [playbackSpeed])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    if (isPlaying) {
      if (isReadyRef.current || audio.readyState >= 3) {
        audio.play().catch(() => setPlaying(false))
      } else {
        const onReady = () => {
          audio.play().catch(() => setPlaying(false))
          audio.removeEventListener("canplay", onReady)
        }
        audio.addEventListener("canplay", onReady)
      }
    } else {
      audio.pause()
    }
  }, [isPlaying])

  const handleSeek = useCallback(
    (time: number) => {
      seekTo(time)
    },
    [seekTo]
  )

  const toggleRepeat = () => {
    const modes: Array<"none" | "ayah" | "surah"> = ["none", "ayah", "surah"]
    const idx = modes.indexOf(repeatMode)
    setRepeatMode(modes[(idx + 1) % modes.length])
  }

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-4 w-4" />
    if (volume < 0.5) return <Volume1 className="h-4 w-4" />
    return <Volume2 className="h-4 w-4" />
  }

  if (!currentTrack) return null

  return (
    <>
      <audio ref={audioRef} preload="auto" />

      <AnimatePresence>
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-md shadow-lg"
        >
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-2 cursor-pointer",
              isExpanded && "hidden"
            )}
            onClick={() => setExpanded(true)}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {currentTrack.surahName}
              </p>
              <p className="text-xs text-muted-foreground">
                Ayah {currentTrack.ayahNumber}
              </p>
            </div>
            <SpeedControl />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                togglePlay()
              }}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current" />
              )}
            </Button>
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              className="flex-1 hidden sm:flex"
            />
            <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
          </div>

          <div className={cn(isExpanded ? "block" : "hidden")}>
            <div className="px-4 pt-3 pb-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {currentTrack.surahName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ayah {currentTrack.ayahNumber}
                    {repeatMode === "ayah" && " — Repeating Ayah"}
                    {repeatMode === "surah" && " — Repeating Surah"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={clearQueue}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={toggleRepeat}
                    title={`Repeat: ${repeatMode}`}
                  >
                    {repeatMode === "ayah" ? (
                      <Repeat1 className="h-4 w-4 text-primary" />
                    ) : repeatMode === "surah" ? (
                      <Repeat className="h-4 w-4 text-primary" />
                    ) : (
                      <Repeat className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={playPrevious}
                  >
                    <SkipBack className="h-5 w-5 fill-current" />
                  </Button>

                  <Button
                    variant="default"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={togglePlay}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    ) : isPlaying ? (
                      <Pause className="h-5 w-5 fill-current" />
                    ) : (
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={playNext}
                  >
                    <SkipForward className="h-5 w-5 fill-current" />
                  </Button>
                </div>

                <div className="flex items-center gap-1">
                  <SpeedControl />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 relative group/vol"
                    onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
                  >
                    {getVolumeIcon()}
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 h-20 w-1.5 origin-bottom rotate-0 opacity-0 group-hover/vol:opacity-100 group-focus-within/vol:opacity-100 transition-opacity cursor-pointer"
                      style={{ writingMode: "vertical-lr", direction: "rtl" }}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Volume: ${Math.round(volume * 100)}%`}
                    />
                  </Button>
                </div>
              </div>
            </div>

            <button
              className="w-full py-1 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
              onClick={() => setExpanded(false)}
            >
              <ChevronDown className="h-3 w-3" />
              Collapse
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
