"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Flame,
  Target,
  BookOpen,
  Bookmark,
  Heart,
  History,
  FileText,
  Bell,
  ChevronRight,
  ArrowRight,
  BookMarked,
  Clock,
  Eye,
  Quote,
  Star,
  Trash2,
  Settings,
  User,
  TrendingUp,
  Library,
  Lightbulb,
  CheckCircle2,
  ListChecks,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useBookmarkStore } from "@/store/bookmarkStore"
import { useFavoriteStore } from "@/store/favoriteStore"
import { useProgressStore } from "@/store/progressStore"
import { useNoteStore } from "@/store/noteStore"
import { useHighlightStore } from "@/store/highlightStore"
import { useAuthStore } from "@/store/authStore"
import api from "@/lib/api"
import type { Surah } from "@/types"

const tabs = [
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "history", label: "History", icon: History },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "notifications", label: "Notifications", icon: Bell },
] as const

type TabId = (typeof tabs)[number]["id"]

function formatDate(timestamp: number) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const mins = Math.floor(diff / (1000 * 60))
      return `${mins}m ago`
    }
    return `${hours}h ago`
  }
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function computeStreak(progress: { timestamp: number }[]) {
  if (progress.length === 0) return 0
  const dates = [
    ...new Set(
      progress.map((p) =>
        new Date(p.timestamp).toISOString().split("T")[0]
      )
    ),
  ].sort((a, b) => b.localeCompare(a))

  let streak = 0
  const today = new Date().toISOString().split("T")[0]
  const yesterdayDate = new Date()
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)
  const yesterday = yesterdayDate.toISOString().split("T")[0]

  if (dates[0] !== today && dates[0] !== yesterday) return 0

  for (let i = 0; i < dates.length; i++) {
    const current = new Date(dates[i])
    const prev = new Date(dates[i + 1])
    const diffDays = Math.round(
      (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    )
    streak++
    if (diffDays !== 1) break
  }

  return streak
}

function getTodayCount(progress: { timestamp: number }[]) {
  const today = new Date().toISOString().split("T")[0]
  return progress.filter(
    (p) => new Date(p.timestamp).toISOString().split("T")[0] === today
  ).length
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("bookmarks")
  const [surahNames, setSurahNames] = useState<Record<number, string>>({})
  const [loadingNames, setLoadingNames] = useState(true)

  const { user } = useAuthStore()
  const { bookmarks, removeBookmark } = useBookmarkStore()
  const { favorites, toggleFavorite } = useFavoriteStore()
  const { progress } = useProgressStore()
  const { notes, removeNote } = useNoteStore()
  const { highlights } = useHighlightStore()

  const fetchSurahNames = useCallback(async () => {
    try {
      const { data } = await api.get("/surahs/summary")
      const names: Record<number, string> = {}
      ;(data.data || data || []).forEach((s: Surah) => {
        names[s.surahNumber] = s.nameSimple
      })
      setSurahNames(names)
    } catch {
      /* fallback handled in display */
    } finally {
      setLoadingNames(false)
    }
  }, [])

  useEffect(() => {
    fetchSurahNames()
  }, [fetchSurahNames])

  const streak = useMemo(() => computeStreak(progress), [progress])
  const todayCount = useMemo(() => getTodayCount(progress), [progress])
  const dailyGoal = 20

  const sortedBookmarks = useMemo(
    () => [...bookmarks].sort((a, b) => b.timestamp - a.timestamp),
    [bookmarks]
  )

  const sortedFavorites = useMemo(
    () => [...favorites].sort((a, b) => b.timestamp - a.timestamp),
    [favorites]
  )

  const sortedProgress = useMemo(
    () => [...progress].sort((a, b) => b.timestamp - a.timestamp),
    [progress]
  )

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => b.timestamp - a.timestamp),
    [notes]
  )

  const recentHighlights = useMemo(
    () =>
      [...highlights]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5),
    [highlights]
  )

  const continueReading = useMemo(() => {
    const sorted = [...progress].sort((a, b) => b.timestamp - a.timestamp)
    return sorted[0] || null
  }, [progress])

  function getSurahName(num: number) {
    return surahNames[num] || `Surah ${num}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Welcome back{user?.name ? `, ${user.name}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-orange-500/10" />
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Flame className="h-4 w-4 text-orange-500" />
                  Reading Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{streak}</span>
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {streak === 0
                    ? "Start reading today to begin your streak"
                    : streak === 1
                    ? "Read yesterday too to build your streak"
                    : `Reading for ${streak} consecutive days`}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-emerald-500/10" />
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Target className="h-4 w-4 text-emerald-500" />
                  Daily Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{todayCount}</span>
                  <span className="text-sm text-muted-foreground">
                    / {dailyGoal} ayahs
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, (todayCount / dailyGoal) * 100)}%`,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full transition-all",
                      todayCount >= dailyGoal
                        ? "bg-emerald-500"
                        : "bg-primary"
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-blue-500/10" />
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{bookmarks.length}</p>
                    <p className="text-xs text-muted-foreground">Bookmarks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{favorites.length}</p>
                    <p className="text-xs text-muted-foreground">Favorites</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{notes.length}</p>
                    <p className="text-xs text-muted-foreground">Notes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{highlights.length}</p>
                    <p className="text-xs text-muted-foreground">
                      Highlights
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {continueReading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mb-6"
          >
            <Link href={`/surahs/${continueReading.surahNumber}`}>
              <Card className="group cursor-pointer border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 transition-all hover:border-primary/40 hover:shadow-md">
                <CardContent className="flex items-center justify-between p-4 md:p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Continue Reading
                      </p>
                      <p className="font-semibold">
                        {getSurahName(continueReading.surahNumber)} · Ayah{" "}
                        {continueReading.ayahNumber}
                      </p>
                      {continueReading.percentage > 0 && (
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${continueReading.percentage}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {continueReading.percentage}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        )}

        {continueReading && progress.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-6"
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Library className="h-4 w-4" />
                  Recently Read Surahs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[...progress]
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .slice(0, 8)
                    .map((p) => (
                      <Link
                        key={`${p.surahNumber}-${p.timestamp}`}
                        href={`/surahs/${p.surahNumber}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {getSurahName(p.surahNumber)}
                        <span className="text-muted-foreground">
                          · {p.percentage}%
                        </span>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-0">
              <div className="flex flex-wrap gap-1" role="tablist" aria-label="Dashboard tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`tabpanel-${tab.id}`}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  role="tabpanel"
                  id={`tabpanel-${activeTab}`}
                  aria-labelledby={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabContent
                    tab={activeTab}
                    bookmarks={sortedBookmarks}
                    favorites={sortedFavorites}
                    progress={sortedProgress}
                    notes={sortedNotes}
                    highlights={recentHighlights}
                    surahNames={surahNames}
                    loadingNames={loadingNames}
                    getSurahName={getSurahName}
                    onRemoveBookmark={removeBookmark}
                    onToggleFavorite={toggleFavorite}
                    onRemoveNote={removeNote}
                  />
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function TabContent({
  tab,
  bookmarks,
  favorites,
  progress,
  notes,
  highlights,
  surahNames,
  loadingNames,
  getSurahName,
  onRemoveBookmark,
  onToggleFavorite,
  onRemoveNote,
}: {
  tab: TabId
  bookmarks: { surahNumber: number; ayahNumber: number; timestamp: number; note?: string }[]
  favorites: { surahNumber: number; ayahNumber: number; timestamp: number }[]
  progress: { surahNumber: number; ayahNumber: number; timestamp: number; percentage: number }[]
  notes: { surahNumber: number; ayahNumber: number; text: string; timestamp: number }[]
  highlights: { surahNumber: number; ayahNumber: number; color: string; timestamp: number }[]
  surahNames: Record<number, string>
  loadingNames: boolean
  getSurahName: (num: number) => string
  onRemoveBookmark: (surahNumber: number, ayahNumber: number) => void
  onToggleFavorite: (surahNumber: number, ayahNumber: number) => void
  onRemoveNote: (surahNumber: number, ayahNumber: number) => void
}) {
  if (loadingNames) {
    return (
      <div className="space-y-3 py-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  switch (tab) {
    case "bookmarks":
      return bookmarks.length === 0 ? (
        <EmptyTab
          icon={BookMarked}
          title="No bookmarks yet"
          description="Bookmark verses while reading to see them here"
          actionLabel="Start Reading"
          actionHref="/surahs"
        />
      ) : (
        <div className="divide-y">
          {bookmarks.map((b) => (
            <div
              key={`bm-${b.surahNumber}-${b.ayahNumber}`}
              className="group flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <Link
                href={`/surahs/${b.surahNumber}`}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                  <Bookmark className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {getSurahName(b.surahNumber)} · Ayah {b.ayahNumber}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(b.timestamp)}
                    {b.note && (
                      <>
                        <span>·</span>
                        <span className="truncate">{b.note}</span>
                      </>
                    )}
                  </p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemoveBookmark(b.surahNumber, b.ayahNumber)}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )

    case "favorites":
      return favorites.length === 0 ? (
        <EmptyTab
          icon={Heart}
          title="No favorites yet"
          description="Mark verses as favorites while reading"
          actionLabel="Start Reading"
          actionHref="/surahs"
        />
      ) : (
        <div className="divide-y">
          {favorites.map((f) => (
            <div
              key={`fav-${f.surahNumber}-${f.ayahNumber}`}
              className="group flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <Link
                href={`/surahs/${f.surahNumber}`}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400">
                  <Heart className="h-4 w-4 fill-current" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {getSurahName(f.surahNumber)} · Ayah {f.ayahNumber}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(f.timestamp)}
                  </p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onToggleFavorite(f.surahNumber, f.ayahNumber)}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )

    case "history":
      return progress.length === 0 ? (
        <EmptyTab
          icon={History}
          title="No reading history"
          description="Your reading progress will appear here"
          actionLabel="Start Reading"
          actionHref="/surahs"
        />
      ) : (
        <div className="divide-y">
          {progress.map((p, idx) => (
            <div
              key={`prog-${p.surahNumber}-${p.timestamp}-${idx}`}
              className="group flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <Link
                href={`/surahs/${p.surahNumber}`}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  <Eye className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {getSurahName(p.surahNumber)} · Ayah {p.ayahNumber}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(p.timestamp)}
                    </p>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {p.percentage}% complete
                    </span>
                  </div>
                </div>
              </Link>
              <div className="h-8 w-8 shrink-0">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `hsl(var(--primary) / ${Math.max(0.1, p.percentage / 100)})`,
                    color: "hsl(var(--primary))",
                  }}
                >
                  {p.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )

    case "notes":
      return notes.length === 0 ? (
        <EmptyTab
          icon={FileText}
          title="No notes yet"
          description="Add notes to verses while reading"
          actionLabel="Start Reading"
          actionHref="/surahs"
        />
      ) : (
        <div className="divide-y">
          {notes.map((n) => (
            <div
              key={`note-${n.surahNumber}-${n.ayahNumber}`}
              className="group flex items-start justify-between py-3 first:pt-0 last:pb-0"
            >
              <Link
                href={`/surahs/${n.surahNumber}`}
                className="flex min-w-0 flex-1 items-start gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  <Quote className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {getSurahName(n.surahNumber)} · Ayah {n.ayahNumber}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {n.text}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(n.timestamp)}
                  </p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemoveNote(n.surahNumber, n.ayahNumber)}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )

    case "notifications":
      const activity: {
        icon: typeof Bell
        iconBg: string
        iconColor: string
        title: string
        description: string
        timestamp: number
        href?: string
      }[] = []

      if (bookmarks.length > 0) {
        const latest = bookmarks[0]
        activity.push({
          icon: Bookmark,
          iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
          iconColor: "text-yellow-700 dark:text-yellow-400",
          title: "New Bookmark",
          description: `Bookmarked ${getSurahName(latest.surahNumber)} · Ayah ${latest.ayahNumber}`,
          timestamp: latest.timestamp,
          href: `/surahs/${latest.surahNumber}`,
        })
      }

      if (favorites.length > 0) {
        const latest = favorites[0]
        activity.push({
          icon: Heart,
          iconBg: "bg-pink-100 dark:bg-pink-900/30",
          iconColor: "text-pink-700 dark:text-pink-400",
          title: "New Favorite",
          description: `Marked ${getSurahName(latest.surahNumber)} · Ayah ${latest.ayahNumber} as favorite`,
          timestamp: latest.timestamp,
          href: `/surahs/${latest.surahNumber}`,
        })
      }

      if (notes.length > 0) {
        const latest = notes[0]
        activity.push({
          icon: FileText,
          iconBg: "bg-purple-100 dark:bg-purple-900/30",
          iconColor: "text-purple-700 dark:text-purple-400",
          title: "New Note",
          description: `Added note to ${getSurahName(latest.surahNumber)} · Ayah ${latest.ayahNumber}`,
          timestamp: latest.timestamp,
          href: `/surahs/${latest.surahNumber}`,
        })
      }

      if (progress.length > 0) {
        const latest = progress[0]
        activity.push({
          icon: Eye,
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
          iconColor: "text-blue-700 dark:text-blue-400",
          title: "Reading Progress",
          description: `Read ${getSurahName(latest.surahNumber)} · Ayah ${latest.ayahNumber}`,
          timestamp: latest.timestamp,
          href: `/surahs/${latest.surahNumber}`,
        })

        if (progress.length >= 5) {
          activity.push({
            icon: Star,
            iconBg: "bg-amber-100 dark:bg-amber-900/30",
            iconColor: "text-amber-700 dark:text-amber-400",
            title: "Milestone",
            description: `Completed ${progress.length} reading sessions`,
            timestamp: Date.now(),
          })
        }
      }

      if (highlights.length > 0) {
        const latest = highlights[0]
        activity.push({
          icon: Lightbulb,
          iconBg: "bg-green-100 dark:bg-green-900/30",
          iconColor: "text-green-700 dark:text-green-400",
          title: "New Highlight",
          description: `Highlighted ${getSurahName(latest.surahNumber)} · Ayah ${latest.ayahNumber}`,
          timestamp: latest.timestamp,
          href: `/surahs/${latest.surahNumber}`,
        })
      }

      return activity.length === 0 ? (
        <EmptyTab
          icon={Bell}
          title="No notifications"
          description="Your activity and updates will appear here"
          actionLabel="Start Reading"
          actionHref="/surahs"
        />
      ) : (
        <div className="divide-y">
          {activity
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((item, idx) => (
              <div
                key={`notif-${idx}`}
                className="group flex items-start gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.iconBg} ${item.iconColor}`}
                >
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.description}
                    </Link>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDate(item.timestamp)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )
  }
}

function EmptyTab({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: typeof BookMarked
  title: string
  description: string
  actionLabel: string
  actionHref: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      <Link href={actionHref}>
        <Button className="mt-4 gap-2">
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  )
}
