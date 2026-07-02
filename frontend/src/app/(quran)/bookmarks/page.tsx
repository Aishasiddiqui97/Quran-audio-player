"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Bookmark, Clock, Trash2, ArrowRight, BookOpen, Sparkles, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useBookmarkStore } from "@/store/bookmarkStore"
import { cn } from "@/lib/utils"

function formatDate(timestamp: number) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useBookmarkStore()
  const [loading, setLoading] = useState(false)

  const sortedBookmarks = useMemo(
    () => [...bookmarks].sort((a, b) => b.timestamp - a.timestamp),
    [bookmarks]
  )

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
            <Bookmark className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Bookmarks
            </h1>
            <p className="text-sm text-muted-foreground">
              Your saved verses for quick reference
            </p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : sortedBookmarks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 flex items-center justify-center mb-6">
            <Bookmark className="h-10 w-10 text-amber-400/60" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No bookmarks yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Bookmark verses while reading to see them here and revisit later.
          </p>
          <Link href="/surahs">
            <Button className="gap-2 bg-gradient-to-r from-islamic-green to-islamic-green-dark text-white shadow-lg hover:shadow-xl">
              <BookOpen className="h-4 w-4" />
              Browse Surahs
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 inline mr-1" />
              {sortedBookmarks.length} bookmark{sortedBookmarks.length !== 1 ? "s" : ""}
            </p>
          </div>
          {sortedBookmarks.map((bm, idx) => (
            <motion.div
              key={`${bm.surahNumber}-${bm.ayahNumber}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="group relative"
            >
              <Link
                href={`/surahs/${bm.surahNumber}`}
                className={cn(
                  "flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4",
                  "card-hover-glow transition-all"
                )}
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 flex items-center justify-center shrink-0 border border-amber-200/30 dark:border-amber-800/30">
                  <Bookmark className="h-5 w-5 text-amber-500 fill-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    Surah {bm.surahNumber} &middot; Ayah {bm.ayahNumber}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" />
                    {formatDate(bm.timestamp)}
                    {bm.note && (
                      <>
                        <span>&middot;</span>
                        <FileText className="h-3 w-3" />
                        <span className="truncate max-w-[200px]">{bm.note}</span>
                      </>
                    )}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-islamic-green transition-colors shrink-0" />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.preventDefault()
                  removeBookmark(bm.surahNumber, bm.ayahNumber)
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
