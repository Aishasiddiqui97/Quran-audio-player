"use client"

import { useAudioPlayerStore } from "@/store/audioPlayerStore"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2]

export function SpeedControl() {
  const { playbackSpeed, setPlaybackSpeed } = useAudioPlayerStore()

  return (
    <Select
      value={String(playbackSpeed)}
      onValueChange={(v) => setPlaybackSpeed(parseFloat(v))}
    >
      <SelectTrigger className="h-8 w-16 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SPEEDS.map((speed) => (
          <SelectItem key={speed} value={String(speed)}>
            {speed}x
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
