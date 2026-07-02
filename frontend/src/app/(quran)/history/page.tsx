"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { History, Clock, Trash2, ArrowRight, BookOpen, Eye, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useProgressStore } from "@/store/progressStore"
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

export default function HistoryPage() {
  const { progress, clearProgress } = useProgressStore()
  const [loading, setLoading] = useState(false)

  const sortedProgress = useMemo(
    () => [...progress].sort((a, b) => b.timestamp - a.timestamp),
    [progress]
  )

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center">
              <History className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                History
              </h1>
              <p className="text-sm text-muted-foreground">
                Your reading journey across the Quran
              </p>
            </div>
          </div>
          {sortedProgress.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive gap-1"
              onClick={clearProgress}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : sortedProgress.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center mb-6">
            <History className="h-10 w-10 text-blue-400/60" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No reading history</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Your reading progress will appear here as you explore the Quran.
          </p>
          <Link href="/surahs">
            <Button className="gap-2 bg-gradient-to-r from-islamic-green to-islamic-green-dark text-white shadow-lg hover:shadow-xl">
              <BookOpen className="h-4 w-4" />
              Start Reading
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
              {sortedProgress.length} session{sortedProgress.length !== 1 ? "s" : ""}
            </p>
          </div>
          {sortedProgress.map((p, idx) => (
            <motion.div
              key={`${p.surahNumber}-${p.timestamp}-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="group relative"
            >
              <Link
                href={`/surahs/${p.surahNumber}`}
                className={cn(
                  "flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4",
                  "card-hover-glow transition-all"
                )}
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center shrink-0 border border-blue-200/30 dark:border-blue-800/30">
                  <Eye className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    Surah {p.surahNumber} &middot; Ayah {p.ayahNumber}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" />
                    {formatDate(p.timestamp)}
                    {p.percentage > 0 && (
                      <>
                        <span>&middot;</span>
                        <span>{p.percentage}% complete</span>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-medium",
                      "bg-islamic-green/10 text-islamic-green"
                    )}
                  >
                    {p.percentage}%
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-islamic-green transition-colors shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
