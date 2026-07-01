"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Copy, Twitter, Facebook, Link } from "lucide-react"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  surahNumber: number
  ayahNumber: number
  ayahText: string
}

export function ShareDialog({
  open,
  onOpenChange,
  surahNumber,
  ayahNumber,
  ayahText,
}: ShareDialogProps) {
  const { toast } = useToast()
  const shareUrl = `${window.location.origin}/surahs/${surahNumber}?ayah=${ayahNumber}`
  const shareText = `${ayahText}\n\nQuran ${surahNumber}:${ayahNumber}\n${shareUrl}`

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({ title: "Link copied!", variant: "success" })
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" })
    }
  }

  function handleTwitter() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      "_blank"
    )
  }

  function handleFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}&u=${encodeURIComponent(shareUrl)}`,
      "_blank"
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Verse</DialogTitle>
          <DialogDescription>
            Surah {surahNumber}, Verse {ayahNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md bg-muted p-3 text-sm text-right leading-relaxed" dir="rtl">
          {ayahText}
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-2">
            <Link className="h-4 w-4" />
            Copy Link
          </Button>
          <Button variant="outline" size="sm" onClick={handleTwitter} className="gap-2">
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>
          <Button variant="outline" size="sm" onClick={handleFacebook} className="gap-2">
            <Facebook className="h-4 w-4" />
            Facebook
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
