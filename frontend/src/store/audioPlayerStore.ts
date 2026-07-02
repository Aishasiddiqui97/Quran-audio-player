import { create } from "zustand"
import { persist } from "zustand/middleware"

export type RepeatMode = "none" | "ayah" | "surah"

export interface AudioTrack {
  surahNumber: number
  ayahNumber: number
  surahName: string
  audioUrl: string
  reciterName?: string
}

interface AudioPlayerState {
  currentTrack: AudioTrack | null
  queue: AudioTrack[]
  queueIndex: number
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  playbackSpeed: number
  repeatMode: RepeatMode
  isExpanded: boolean
  isLoading: boolean

  setTrack: (track: AudioTrack) => void
  setQueue: (tracks: AudioTrack[], startIndex?: number) => void
  setPlaying: (playing: boolean) => void
  togglePlay: () => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setVolume: (volume: number) => void
  setPlaybackSpeed: (speed: number) => void
  setRepeatMode: (mode: RepeatMode) => void
  setExpanded: (expanded: boolean) => void
  toggleExpanded: () => void
  setLoading: (loading: boolean) => void
  playNext: () => void
  playPrevious: () => void
  seekTo: (time: number) => void
  clearQueue: () => void
}

export const useAudioPlayerStore = create<AudioPlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      queue: [],
      queueIndex: -1,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      playbackSpeed: 1,
      repeatMode: "none",
      isExpanded: false,
      isLoading: false,

      setTrack: (track) =>
        set({
          currentTrack: track,
          isPlaying: false,
          currentTime: 0,
          duration: 0,
          isExpanded: true,
          isLoading: true,
        }),

      setQueue: (tracks, startIndex = 0) =>
        set({
          queue: tracks,
          queueIndex: startIndex,
          currentTrack: tracks[startIndex] || null,
          isPlaying: false,
          currentTime: 0,
          duration: 0,
          isExpanded: true,
          isLoading: true,
        }),

      setPlaying: (playing) => set({ isPlaying: playing }),
      togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
      setRepeatMode: (mode) => set({ repeatMode: mode }),
      setExpanded: (expanded) => set({ isExpanded: expanded }),
      toggleExpanded: () => set((s) => ({ isExpanded: !s.isExpanded })),
      setLoading: (loading) => set({ isLoading: loading }),

      playNext: () => {
        const { queue, queueIndex, repeatMode, currentTrack } = get()
        if (repeatMode === "ayah" && currentTrack) {
          const audio = document.querySelector("audio")
          if (audio) {
            audio.currentTime = 0
            audio.play()
          }
          set({ currentTime: 0 })
          return
        }
        if (queueIndex < queue.length - 1) {
          const nextIdx = queueIndex + 1
          set({
            queueIndex: nextIdx,
            currentTrack: queue[nextIdx],
            currentTime: 0,
            duration: 0,
            isPlaying: true,
          })
        } else if (repeatMode === "surah" && queue.length > 0) {
          set({
            queueIndex: 0,
            currentTrack: queue[0],
            currentTime: 0,
            duration: 0,
            isPlaying: true,
          })
        } else {
          set({ isPlaying: false })
        }
      },

      playPrevious: () => {
        const { queue, queueIndex, currentTime } = get()
        if (currentTime > 3) {
          set({ currentTime: 0 })
          const audio = document.querySelector("audio")
          if (audio) audio.currentTime = 0
          return
        }
        if (queueIndex > 0) {
          const prevIdx = queueIndex - 1
          set({
            queueIndex: prevIdx,
            currentTrack: queue[prevIdx],
            currentTime: 0,
            duration: 0,
            isPlaying: true,
          })
        }
      },

      seekTo: (time) => {
        set({ currentTime: time })
        const audio = document.querySelector("audio")
        if (audio) audio.currentTime = time
      },

      clearQueue: () =>
        set({
          queue: [],
          queueIndex: -1,
          currentTrack: null,
          isPlaying: false,
          currentTime: 0,
          duration: 0,
          isExpanded: false,
        }),
    }),
    {
      name: "quran-audio-player",
      partialize: (state) => ({
        volume: state.volume,
        playbackSpeed: state.playbackSpeed,
        repeatMode: state.repeatMode,
      }),
    }
  )
)
