"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, BookOpen, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SurahCard } from "@/components/quran/SurahCard"
import { SurahSkeleton } from "@/components/quran/SurahSkeleton"
import { ErrorState } from "@/components/quran/ErrorState"
import { EmptyState } from "@/components/quran/EmptyState"
import { useProgressStore } from "@/store/progressStore"
import Link from "next/link"
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

const ARABIC_NAMES: Record<number, string> = {
  1: "الفاتحة", 2: "البقرة", 3: "آل عمران", 4: "النساء", 5: "المائدة",
  6: "الأنعام", 7: "الأعراف", 8: "الأنفال", 9: "التوبة", 10: "يونس",
  11: "هود", 12: "يوسف", 13: "الرعد", 14: "إبراهيم", 15: "الحجر",
  16: "النحل", 17: "الإسراء", 18: "الكهف", 19: "مريم", 20: "طه",
  21: "الأنبياء", 22: "الحج", 23: "المؤمنون", 24: "النور", 25: "الفرقان",
  26: "الشعراء", 27: "النمل", 28: "القصص", 29: "العنكبوت", 30: "الروم",
  31: "لقمان", 32: "السجدة", 33: "الأحزاب", 34: "سبأ", 35: "فاطر",
  36: "يس", 37: "الصافات", 38: "ص", 39: "الزمر", 40: "غافر",
  41: "فصلت", 42: "الشورى", 43: "الزخرف", 44: "الدخان", 45: "الجاثية",
  46: "الأحقاف", 47: "محمد", 48: "الفتح", 49: "الحجرات", 50: "ق",
  51: "الذاريات", 52: "الطور", 53: "النجم", 54: "القمر", 55: "الرحمن",
  56: "الواقعة", 57: "الحديد", 58: "المجادلة", 59: "الحشر", 60: "الممتحنة",
  61: "الصف", 62: "الجمعة", 63: "المنافقون", 64: "التغابن", 65: "الطلاق",
  66: "التحريم", 67: "الملك", 68: "القلم", 69: "الحاقة", 70: "المعارج",
  71: "نوح", 72: "الجن", 73: "المزمل", 74: "المدثر", 75: "القيامة",
  76: "الإنسان", 77: "المرسلات", 78: "النبأ", 79: "النازعات", 80: "عبس",
  81: "التكوير", 82: "الإنفطار", 83: "المطففين", 84: "الإنشقاق", 85: "البروج",
  86: "الطارق", 87: "الأعلى", 88: "الغاشية", 89: "الفجر", 90: "البلد",
  91: "الشمس", 92: "الليل", 93: "الضحى", 94: "الشرح", 95: "التين",
  96: "العلق", 97: "القدر", 98: "البينة", 99: "الزلزلة", 100: "العاديات",
  101: "القارعة", 102: "التكاثر", 103: "العصر", 104: "الهمزة", 105: "الفيل",
  106: "قريش", 107: "الماعون", 108: "الكوثر", 109: "الكافرون", 110: "النصر",
  111: "المسد", 112: "الإخلاص", 113: "الفلق", 114: "الناس",
}

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
  "k": ["q"],
  "q": ["k"],
  "c": ["s", "k"],
  "s": ["c"],
  "i": ["e", "y"],
  "e": ["i", "a"],
  "a": ["e"],
  "o": ["u"],
  "u": ["o"],
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

    const searchFields = [
      s.nameArabic,
      s.nameSimple,
      s.nameEnglish,
    ]

    for (const field of searchFields) {
      const nt = normalizeText(field)
      if (isFuzzyMatch(nq, nt)) return true
    }

    return false
  })
}

function mapApiSurah(api: ApiSurah): Surah {
  return {
    surahNumber: api.number,
    nameArabic: ARABIC_NAMES[api.number] || api.name,
    nameSimple: api.englishName,
    nameEnglish: api.englishNameTranslation,
    revelationType: api.revelationType,
    totalAyahs: api.numberOfAyahs,
  }
}

export default function SurahsPage() {
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const { getContinueReading } = useProgressStore()
  const continueReading = getContinueReading()

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

  useEffect(() => {
    fetchSurahs()
  }, [fetchSurahs])

  const filtered = useMemo(() => searchSurahs(surahs, search), [surahs, search])

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Surahs
          </span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Select a surah to begin reading
        </p>
      </motion.div>

      {continueReading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link href={`/surahs/${continueReading.surahNumber}`}>
            <Button
              variant="outline"
              className="w-full gap-2 border-primary/30 hover:border-primary"
            >
              <BookOpen className="h-4 w-4" />
              Continue Reading: Surah {continueReading.surahNumber} (Ayah{" "}
              {continueReading.ayahNumber})
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      )}

      {!loading && !error && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search surahs by name or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {loading ? (
        <SurahSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchSurahs} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Surah Found"
          description={
            search
              ? `No surah matches "${search}"`
              : "No surahs available"
          }
        />
      ) : (
        <div className="grid gap-3">
          {filtered.map((surah, index) => (
            <SurahCard key={surah.surahNumber} surah={surah} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
