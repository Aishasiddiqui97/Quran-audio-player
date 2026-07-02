"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AyahCard } from "@/components/quran/AyahCard"
import { FontControls } from "@/components/quran/FontControls"
import { AyahSkeleton } from "@/components/quran/AyahSkeleton"
import { ErrorState } from "@/components/quran/ErrorState"
import { EmptyState } from "@/components/quran/EmptyState"
import { useBookmarkStore } from "@/store/bookmarkStore"
import { useFavoriteStore } from "@/store/favoriteStore"
import { useHighlightStore } from "@/store/highlightStore"
import { useReaderStore } from "@/store/readerStore"
import api from "@/lib/api"
import type { Ayah, Translation, WordByWord, Surah } from "@/types"

export default function JuzPage() {
  const params = useParams()
  const juzNumber = parseInt(params.juzNumber as string, 10)

  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [surahNames, setSurahNames] = useState<Record<number, string>>({})
  const [translations, setTranslations] = useState<Record<string, Translation>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const bookmarks = useBookmarkStore((s) => s.bookmarks)
  const addBookmark = useBookmarkStore((s) => s.addBookmark)
  const removeBookmark = useBookmarkStore((s) => s.removeBookmark)
  const favorites = useFavoriteStore((s) => s.favorites)
  const toggleFavorite = useFavoriteStore((s) => s.toggleFavorite)
  const { toggleHighlight } = useHighlightStore()
  const { translationLanguage } = useReaderStore()

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [ayahRes, surahRes] = await Promise.all([
        api.get(`/ayahs/juz/${juzNumber}`, { params: { limit: 500 } }),
        api.get("/surahs/summary"),
      ])
      setAyahs(ayahRes.data.data || [])

      const nameMap: Record<number, string> = {}
      ;(surahRes.data.data || []).forEach((s: Surah) => {
        nameMap[s.surahNumber] = s.nameSimple
      })
      setSurahNames(nameMap)
    } catch {
      setError("Failed to load Juz data. Please try again.")
      setLoading(false)
      return
    }

    try {
      if (translationLanguage !== "off") {
        const lang = translationLanguage === "ur" ? "ur" : "en"
        const transRes = await api.get("/translations", {
          params: { language: lang, limit: 1000 },
        })
        const transMap: Record<string, Translation> = {}
        ;(transRes.data.data || []).forEach((t: Translation) => {
          transMap[`${t.surahNumber}:${t.ayahNumber}`] = t
        })
        setTranslations(transMap)
      }
    } catch {
      /* translations optional */
    }

    setLoading(false)
  }, [juzNumber, translationLanguage])

  const surahsInJuz = [...new Set(ayahs.map((a) => a.surahNumber))]

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    const ayahCount = ayahs.length
    if (ayahCount === 0) return
    const surahCount = new Set(ayahs.map((a) => a.surahNumber)).size
    document.title = `Juz ${juzNumber} - Read the Quran | Noor-ul-Quran`
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        `Read Juz ${juzNumber} of the Holy Quran - ${ayahCount} verses across ${surahCount} surahs. Arabic text with translations and audio recitation.`
      )
    }
  }, [juzNumber, ayahs.length])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
          <AyahSkeleton />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    )
  }

  if (ayahs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title={`Juz ${juzNumber} is empty`}
          description="No verses found for this Juz."
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Link
            href="/surahs"
            className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Surahs
          </Link>
          <h1 className="text-3xl font-bold">Juz {juzNumber}</h1>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {surahsInJuz.map((s) => (
              <Link
                key={s}
                href={`/surahs/${s}`}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary hover:bg-primary/20 transition-colors"
              >
                {surahNames[s] || `Surah ${s}`}
              </Link>
            ))}
          </div>
        </motion.div>

        <FontControls />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {ayahs.map((ayah) => (
            <AyahCard
              key={`${ayah.surahNumber}:${ayah.ayahNumber}`}
              ayah={ayah}
              surahName={surahNames[ayah.surahNumber] || `Surah ${ayah.surahNumber}`}
              translation={translations[`${ayah.surahNumber}:${ayah.ayahNumber}`]}
              isBookmarked={bookmarks.some((b) => b.surahNumber === ayah.surahNumber && b.ayahNumber === ayah.ayahNumber)}
              isFavorited={favorites.some((f) => f.surahNumber === ayah.surahNumber && f.ayahNumber === ayah.ayahNumber)}
              onToggleBookmark={() => {
                if (bookmarks.some((b) => b.surahNumber === ayah.surahNumber && b.ayahNumber === ayah.ayahNumber)) {
                  removeBookmark(ayah.surahNumber, ayah.ayahNumber)
                } else {
                  addBookmark(ayah.surahNumber, ayah.ayahNumber)
                }
              }}
              onToggleFavorite={() => {
                toggleFavorite(ayah.surahNumber, ayah.ayahNumber)
              }}
              onHighlight={(color) => {
                toggleHighlight(ayah.surahNumber, ayah.ayahNumber, color)
              }}
              onNote={() => {}}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
