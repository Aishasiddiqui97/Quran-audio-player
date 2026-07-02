"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, BookOpen, ArrowRight, LayoutGrid, List, ArrowUpDown, MapPin, BookText, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SurahCard } from "@/components/quran/SurahCard"
import { SurahSkeleton } from "@/components/quran/SurahSkeleton"
import { ErrorState } from "@/components/quran/ErrorState"
import { EmptyState } from "@/components/quran/EmptyState"
import { useProgressStore } from "@/store/progressStore"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Surah } from "@/types"

interface ApiSurah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  revelationType: "Meccan" | "Medinan"
  numberOfAyahs: number
}

interface ApiResponse {
  code: number
  status: string
  data: ApiSurah[]
}

const ALQURAN_API = "https://api.alquran.cloud/v1"

const FILLER_WORDS = ["surah", "surahs", "surat", "chapter"]

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, "")
    .replace(/[^a-z0-9\u0600-\u06FF]/g, "")
}

function cleanSearchQuery(query: string): string {
  let q = query.toLowerCase().trim()
  for (const filler of FILLER_WORDS) {
    q = q.replace(new RegExp(`\\b${filler}\\b`, "gi"), "")
  }
  return q.trim()
}

const SUBSTITUTIONS: Record<string, string[]> = {
  "k": ["q"], "q": ["k"], "c": ["s", "k"], "s": ["c"],
  "i": ["e", "y"], "e": ["i", "a"], "a": ["e"],
  "o": ["u"], "u": ["o"],
}

function isFuzzyMatch(normalizedQuery: string, normalizedTarget: string): boolean {
  if (normalizedTarget.includes(normalizedQuery)) return true
  for (const [from, replacements] of Object.entries(SUBSTITUTIONS)) {
    if (normalizedQuery.includes(from)) {
      for (const to of replacements) {
        const variant = normalizedQuery.replace(new RegExp(from, "g"), to)
        if (normalizedTarget.includes(variant)) return true
      }
    }
  }
  if (normalizedQuery.endsWith("h") && normalizedTarget.includes(normalizedQuery.slice(0, -1))) return true
  if (normalizedTarget.endsWith("h") && normalizedQuery.includes(normalizedTarget.slice(0, -1))) return true
  return false
}

function searchSurahs(surahs: Surah[], query: string): Surah[] {
  if (!query.trim()) return surahs
  const cleanedQuery = cleanSearchQuery(query)
  if (!cleanedQuery) return surahs
  const nq = normalizeText(cleanedQuery)
  if (!nq) return surahs
  return surahs.filter((s) => {
    if (String(s.surahNumber) === cleanedQuery || String(s.surahNumber) === nq) return true
    const searchFields = [s.nameArabic, s.nameSimple, s.nameEnglish]
    for (const field of searchFields) {
      if (isFuzzyMatch(nq, normalizeText(field))) return true
    }
    return false
  })
}

function mapApiSurah(api: ApiSurah): Surah {
  return {
    surahNumber: api.number,
    nameArabic: api.name,
    nameSimple: api.englishName,
    nameEnglish: api.englishNameTranslation,
    revelationType: api.revelationType,
    totalAyahs: api.numberOfAyahs,
  }
}

export default function SurahsPage() {
  const searchParams = useSearchParams()
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"number" | "name" | "revelation">("number")
  const [sortOpen, setSortOpen] = useState(false)

  const fetchSurahs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${ALQURAN_API}/surah`)
      const json: ApiResponse = await res.json()
      if (json.code === 200 && Array.isArray(json.data)) {
        const mapped = json.data.map(mapApiSurah)
        setSurahs(mapped)
      } else {
        throw new Error("Invalid API response")
      }
    } catch {
      setError("Failed to load surahs. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSurahs() }, [fetchSurahs])

  const stats = useMemo(() => {
    return {
      total: surahs.length,
      meccan: surahs.filter((s) => s.revelationType === "Meccan").length,
      medinan: surahs.filter((s) => s.revelationType === "Medinan").length,
      ayahs: surahs.reduce((acc, s) => acc + s.totalAyahs, 0),
    }
  }, [surahs])

  const filtered = useMemo(() => {
    let result = searchSurahs(surahs, search)
    if (sortBy === "name") {
      result = [...result].sort((a, b) => a.nameSimple.localeCompare(b.nameSimple))
    } else if (sortBy === "revelation") {
      result = [...result].sort((a, b) => {
        if (a.revelationType === b.revelationType) return a.surahNumber - b.surahNumber
        return a.revelationType === "Meccan" ? -1 : 1
      })
    }
    return result
  }, [surahs, search, sortBy])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 overflow-hidden rounded-2xl border border-islamic-green/20 bg-gradient-to-br from-islamic-green/[0.04] via-card to-islamic-gold/[0.04] p-6 md:p-8"
      >
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 70% 30%, #0B6B3A 0%, transparent 50%)`,
        }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-islamic-green/10 to-islamic-gold/10 border border-islamic-green/20">
              <BookText className="h-6 w-6 text-islamic-green" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                All <span className="bg-gradient-to-r from-islamic-green to-islamic-green-dark bg-clip-text text-transparent">Surahs</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Browse and recite from the 114 surahs of the Holy Quran
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 rounded-lg bg-islamic-green/5 border border-islamic-green/10 px-3 py-1.5">
              <BookOpen className="h-3.5 w-3.5 text-islamic-green" />
              <span className="text-xs font-medium text-foreground">{stats.total} Surahs</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-islamic-gold/5 border border-islamic-gold/10 px-3 py-1.5">
              <MapPin className="h-3.5 w-3.5 text-islamic-gold" />
              <span className="text-xs font-medium text-foreground">{stats.meccan} Meccan</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-islamic-green/5 border border-islamic-green/10 px-3 py-1.5">
              <Star className="h-3.5 w-3.5 text-islamic-green" />
              <span className="text-xs font-medium text-foreground">{stats.medinan} Medinan</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-islamic-gold/5 border border-islamic-gold/10 px-3 py-1.5">
              <BookText className="h-3.5 w-3.5 text-islamic-gold" />
              <span className="text-xs font-medium text-foreground">{stats.ayahs.toLocaleString()} Ayahs</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Continue Reading */}
      <ContinueReadingSection />

      {/* Toolbar */}
      {!loading && !error && (
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl border-border/60 bg-card/60 focus-visible:border-islamic-green/50"
            />
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-card/60 p-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", viewMode === "grid" && "bg-accent/10 text-islamic-green")}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", viewMode === "list" && "bg-accent/10 text-islamic-green")}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Button
              variant="outline"
              className="h-11 rounded-xl border-border/60 gap-2"
              onClick={() => setSortOpen(!sortOpen)}
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="text-sm hidden sm:inline">
                {sortBy === "number" ? "Number" : sortBy === "name" ? "Name" : "Revelation"}
              </span>
            </Button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-full mt-1.5 bg-card border border-border/60 rounded-xl shadow-soft p-1.5 z-20 min-w-[170px]">
                  {(["number", "name", "revelation"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt); setSortOpen(false) }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                        sortBy === opt ? "bg-islamic-green/10 text-islamic-green font-medium" : "hover:bg-muted"
                      )}
                    >
                      {opt === "number" ? "Surah Number" : opt === "name" ? "Name (A-Z)" : "Revelation Order"}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Results count */}
      {!loading && !error && search && (
        <p className="text-xs text-muted-foreground mb-3">
          {filtered.length} surah{filtered.length !== 1 && "s"} found
          {search && <> for &ldquo;{search}&rdquo;</>}
        </p>
      )}

      {/* Grid/List */}
      {loading ? (
        <SurahSkeleton viewMode={viewMode} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchSurahs} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Surah Found"
          description={search ? `No surah matches "${search}"` : "No surahs available"}
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={viewMode === "grid" ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-2"}
        >
          {filtered.map((surah, index) => (
            <motion.div
              key={surah.surahNumber}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
              }}
            >
              <SurahCard surah={surah} index={index} viewMode={viewMode} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

function ContinueReadingSection() {
  const [show, setShow] = useState(false)
  const [data, setData] = useState<{ surahNumber: number; ayahNumber: number } | null>(null)

  useEffect(() => {
    const { getContinueReading } = useProgressStore.getState()
    const reading = getContinueReading()
    if (reading) {
      setData(reading)
      setShow(true)
    }
  }, [])

  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-5"
    >
      <Link href={`/surahs/${data!.surahNumber}`}>
        <Button
          variant="outline"
          className="w-full gap-2 border-islamic-green/30 hover:border-islamic-green text-islamic-green hover:bg-islamic-green/5 h-11 rounded-xl"
        >
          <BookOpen className="h-4 w-4" />
          Continue Reading: Surah {data!.surahNumber} &mdash; Ayah {data!.ayahNumber}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </motion.div>
  )
}
