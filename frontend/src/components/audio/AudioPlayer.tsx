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
  Disc3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "./ProgressBar"
import { SpeedControl } from "./SpeedControl"
import { useAudioPlayerStore } from "@/store/audioPlayerStore"
import { cn } from "@/lib/utils"

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isReadyRef = useRef(false)
  const handleEndedRef = useRef<(() => void) | null>(null)
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

  handleEndedRef.current = playNext

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => setDuration(audio.duration || 0)
    const onLoadStart = () => { isReadyRef.current = false; setLoading(true) }
    const onCanPlay = () => { isReadyRef.current = true; setLoading(false); setPlaying(true) }
    const onPlaying = () => setLoading(false)
    const onEnded = () => handleEndedRef.current?.()
    const onError = () => { isReadyRef.current = false; setLoading(false) }

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("durationchange", onDurationChange)
    audio.addEventListener("loadstart", onLoadStart)
    audio.addEventListener("canplay", onCanPlay)
    audio.addEventListener("playing", onPlaying)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("error", onError)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("durationchange", onDurationChange)
      audio.removeEventListener("loadstart", onLoadStart)
      audio.removeEventListener("canplay", onCanPlay)
      audio.removeEventListener("playing", onPlaying)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("error", onError)
    }
  }, [setCurrentTime, setDuration, setLoading, setPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    isReadyRef.current = false
    setLoading(true)
    audio.src = currentTrack.audioUrl
    audio.volume = volume
    audio.playbackRate = playbackSpeed
    audio.load()

    const timer = setTimeout(() => {
      if (!audio.paused) {
        isReadyRef.current = true
        setLoading(false)
        setPlaying(true)
      } else if (isReadyRef.current === false) {
        setLoading(false)
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    if (!isPlaying && !isLoading) return

    let frameId: number
    const tick = () => {
      if (!audio.paused) {
        setCurrentTime(audio.currentTime)
        setDuration(audio.duration || 0)
        setLoading(false)
      }
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frameId)
  }, [currentTrack, isPlaying, isLoading])

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

    const onReady = () => {
      audio.play().catch(() => setPlaying(false))
    }

    if (isPlaying) {
      if (isReadyRef.current || audio.readyState >= 3) {
        audio.play().catch(() => setPlaying(false))
      } else {
        audio.addEventListener("canplay", onReady)
      }
    } else {
      audio.pause()
    }

    return () => {
      audio.removeEventListener("canplay", onReady)
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
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          {/* ===== MINI PLAYER ===== */}
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 cursor-pointer",
              "glass-premium border-t border-islamic-green/20",
              "safe-area-bottom",
              isExpanded && "hidden"
            )}
            onClick={() => setExpanded(true)}
          >
            <div className={cn(
              "flex items-center justify-center h-9 w-9 rounded-xl shadow-sm transition-all",
              isPlaying
                ? "bg-gradient-to-br from-islamic-gold to-islamic-gold-dark"
                : "bg-gradient-to-br from-islamic-green to-islamic-green-dark"
            )}>
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-islamic-spin" />
              ) : isPlaying ? (
                <div className="wave-bars">
                  <span className="bg-white" /><span className="bg-white" /><span className="bg-white" /><span className="bg-white" /><span className="bg-white" />
                </div>
              ) : (
                <Play className="h-4 w-4 text-white ml-0.5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-islamic-green-dark dark:text-islamic-green">
                {currentTrack.surahName}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span>Ayah {currentTrack.ayahNumber}</span>
                <span className="text-islamic-gold">•</span>
                <span className="text-islamic-gold/80 text-[10px]">{currentTrack.reciterName || "Mishary Alafasy"}</span>
              </p>
            </div>
            <SpeedControl />
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 transition-all",
                isPlaying
                  ? "text-islamic-gold hover:text-islamic-gold-dark hover:bg-islamic-gold/10"
                  : "text-islamic-green hover:text-islamic-green-dark hover:bg-islamic-green/10"
              )}
              onClick={(e) => {
                e.stopPropagation()
                togglePlay()
              }}
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-islamic-green border-t-transparent rounded-full animate-islamic-spin" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current ml-0.5" />
              )}
            </Button>
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              className="flex-1 hidden sm:flex"
            />
            <div className={cn(
              "flex items-center justify-center h-6 w-6 rounded-full transition-colors",
              isPlaying ? "text-islamic-gold" : "text-muted-foreground"
            )}>
              <ChevronUp className="h-4 w-4" />
            </div>
          </div>

          {/* ===== EXPANDED PLAYER ===== */}
          <div className={cn(isExpanded ? "block" : "hidden")}>
            <div className="glass-premium border-t border-islamic-green/20 px-4 pt-5 pb-4 space-y-5">
              {/* Top bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={cn(
                    "flex items-center justify-center h-10 w-10 rounded-xl shadow-sm shrink-0",
                    isPlaying
                      ? "bg-gradient-to-br from-islamic-gold to-islamic-gold-dark"
                      : "bg-gradient-to-br from-islamic-green to-islamic-green-dark"
                  )}>
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-islamic-spin" />
                    ) : isPlaying ? (
                      <div className="wave-bars">
                        <span className="bg-white" /><span className="bg-white" /><span className="bg-white" /><span className="bg-white" /><span className="bg-white" />
                      </div>
                    ) : (
                      <Disc3 className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate text-islamic-green-dark dark:text-islamic-green">
                      {currentTrack.surahName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ayah {currentTrack.ayahNumber}
                      {repeatMode === "ayah" && " — Repeating Ayah"}
                      {repeatMode === "surah" && " — Repeating Surah"}
                    </p>
                    <p className="text-[10px] text-islamic-gold mt-0.5 font-medium">{currentTrack.reciterName || "Mishary Rashid Alafasy"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isPlaying && (
                    <div className="wave-bars mr-2">
                      <span className="bg-islamic-green" />
                      <span className="bg-islamic-green" />
                      <span className="bg-islamic-green" />
                      <span className="bg-islamic-green" />
                      <span className="bg-islamic-green" />
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={clearQueue}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Progress */}
              <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
              />

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 transition-colors",
                      repeatMode !== "none" ? "text-islamic-gold" : "text-muted-foreground hover:text-islamic-gold"
                    )}
                    onClick={toggleRepeat}
                    title={`Repeat: ${repeatMode}`}
                  >
                    {repeatMode === "ayah" ? (
                      <Repeat1 className="h-4 w-4" />
                    ) : repeatMode === "surah" ? (
                      <Repeat className="h-4 w-4" />
                    ) : (
                      <Repeat className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-islamic-green hover:text-islamic-green-dark hover:bg-islamic-green/10"
                    onClick={playPrevious}
                  >
                    <SkipBack className="h-5 w-5 fill-current" />
                  </Button>

                  <Button
                    size="icon"
                    className={cn(
                      "h-14 w-14 rounded-full shadow-lg transition-all",
                      "bg-gradient-to-br from-islamic-green to-islamic-green-dark",
                      "hover:from-islamic-green-dark hover:to-islamic-green",
                      "hover:shadow-xl hover:scale-105 active:scale-95",
                      isPlaying && "animate-glow"
                    )}
                    onClick={togglePlay}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-islamic-spin" />
                    ) : isPlaying ? (
                      <Pause className="h-6 w-6 fill-white" />
                    ) : (
                      <Play className="h-6 w-6 fill-white ml-0.5" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-islamic-green hover:text-islamic-green-dark hover:bg-islamic-green/10"
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
                    className="h-8 w-8 relative group/vol text-muted-foreground hover:text-islamic-green"
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
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 h-20 w-1.5 origin-bottom rotate-0 opacity-0 group-hover/vol:opacity-100 group-focus-within/vol:opacity-100 transition-opacity cursor-pointer accent-islamic-green"
                      style={{ writingMode: "vertical-lr", direction: "rtl" }}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Volume: ${Math.round(volume * 100)}%`}
                    />
                  </Button>
                </div>
              </div>
            </div>

            {/* Collapse button */}
            <button
              className="w-full py-2 text-xs text-islamic-gold hover:text-islamic-gold-dark transition-colors flex items-center justify-center gap-1.5 glass-premium border-t border-islamic-green/10"
              onClick={() => setExpanded(false)}
            >
              <ChevronDown className="h-3 w-3" />
              Collapse Player
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
