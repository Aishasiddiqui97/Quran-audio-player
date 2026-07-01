"use client"

import { useState } from "react"
import {
  Bookmark,
  Heart,
  Copy,
  Share2,
  Highlighter,
  StickyNote,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useHighlightStore } from "@/store/highlightStore"
import { NotesDialog } from "./NotesDialog"
import { ShareDialog } from "./ShareDialog"
import type { Ayah } from "@/types"

interface AyahActionsProps {
  visible: boolean
  ayah: Ayah
  isBookmarked: boolean
  isFavorited: boolean
  onToggleBookmark: () => void
  onToggleFavorite: () => void
  onHighlight: (color: string) => void
  onNote: () => void
}

const HIGHLIGHT_COLORS = [
  { color: "#FEF08A", label: "Yellow" },
  { color: "#FED7AA", label: "Orange" },
  { color: "#A7F3D0", label: "Green" },
  { color: "#BFDBFE", label: "Blue" },
  { color: "#E9D5FF", label: "Purple" },
  { color: "#FECDD3", label: "Pink" },
]

export function AyahActions({
  visible,
  ayah,
  isBookmarked,
  isFavorited,
  onToggleBookmark,
  onToggleFavorite,
  onHighlight,
  onNote,
}: AyahActionsProps) {
  const { toast } = useToast()
  const [showNotes, setShowNotes] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showColors, setShowColors] = useState(false)
  useHighlightStore()

  const ayahText = `${ayah.textArabic}\n\n(${ayah.surahNumber}:${ayah.ayahNumber})`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(ayahText)
      toast({
        title: "Copied!",
        description: "Verse copied to clipboard",
        variant: "success",
      })
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div
        className={`flex items-center gap-1 pt-3 transition-all duration-200 ${
          visible ? "opacity-100 lg:opacity-100" : "opacity-0 group-focus-within:opacity-100 lg:opacity-0"
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggleBookmark}
          title={isBookmarked ? "Remove bookmark" : "Bookmark"}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          <Bookmark
            className={`h-4 w-4 ${isBookmarked ? "fill-yellow-400 text-yellow-500" : ""}`}
          />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggleFavorite}
          title={isFavorited ? "Remove favorite" : "Add to favorites"}
          aria-label={isFavorited ? "Remove favorite" : "Add to favorites"}
        >
          <Heart
            className={`h-4 w-4 ${isFavorited ? "fill-pink-400 text-pink-500" : ""}`}
          />
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowColors(!showColors)}
            title="Highlight"
            aria-label="Highlight verse"
          >
            <Highlighter className="h-4 w-4" />
          </Button>
          {showColors && (
            <div className="absolute bottom-full left-0 mb-2 flex gap-1 rounded-lg border bg-background p-2 shadow-lg">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.color}
                  className="h-6 w-6 rounded-full border border-border transition-transform hover:scale-125"
                  style={{ backgroundColor: c.color }}
                  onClick={() => {
                    onHighlight(c.color)
                    setShowColors(false)
                  }}
                  title={c.label}
                  aria-label={`Highlight in ${c.label.toLowerCase()}`}
                />
              ))}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowNotes(true)}
          title="Add note"
          aria-label="Add note"
        >
          <StickyNote className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleCopy}
          title="Copy verse"
          aria-label="Copy verse"
        >
          <Copy className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowShare(true)}
          title="Share verse"
          aria-label="Share verse"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      <NotesDialog
        open={showNotes}
        onOpenChange={setShowNotes}
        surahNumber={ayah.surahNumber}
        ayahNumber={ayah.ayahNumber}
        ayahText={ayah.textArabic}
      />

      <ShareDialog
        open={showShare}
        onOpenChange={setShowShare}
        surahNumber={ayah.surahNumber}
        ayahNumber={ayah.ayahNumber}
        ayahText={ayah.textArabic}
      />
    </>
  )
}
