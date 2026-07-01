"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useNoteStore } from "@/store/noteStore"
import { Trash2 } from "lucide-react"

interface NotesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  surahNumber: number
  ayahNumber: number
  ayahText: string
}

export function NotesDialog({
  open,
  onOpenChange,
  surahNumber,
  ayahNumber,
  ayahText,
}: NotesDialogProps) {
  const { toast } = useToast()
  const { getNote, addNote, removeNote } = useNoteStore()
  const existing = getNote(surahNumber, ayahNumber)
  const [text, setText] = useState(existing?.text || "")

  useEffect(() => {
    if (open) {
      const note = getNote(surahNumber, ayahNumber)
      setText(note?.text || "")
    }
  }, [open, surahNumber, ayahNumber, getNote])

  function handleSave() {
    if (!text.trim()) {
      removeNote(surahNumber, ayahNumber)
      toast({ title: "Note removed", variant: "success" })
    } else {
      addNote(surahNumber, ayahNumber, text.trim())
      toast({ title: "Note saved", variant: "success" })
    }
    onOpenChange(false)
  }

  function handleDelete() {
    removeNote(surahNumber, ayahNumber)
    setText("")
    toast({ title: "Note deleted", variant: "success" })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Personal Note</DialogTitle>
          <DialogDescription>
            {surahNumber}:{ayahNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md bg-muted p-3 text-sm text-right leading-relaxed" dir="rtl">
            {ayahText}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Your Note</Label>
            <Textarea
              id="note"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your reflections, translations, or notes..."
              rows={4}
            />
          </div>

          <div className="flex items-center justify-between">
            {existing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-destructive gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
