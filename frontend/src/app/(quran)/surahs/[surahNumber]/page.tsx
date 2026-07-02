"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Book, MapPin, Play, ChevronDown, User, Globe, Loader2 } from "lucide-react"
import { useSwipe } from "@/hooks/useSwipe"
import { AyahCard } from "@/components/quran/AyahCard"
import { FontControls } from "@/components/quran/FontControls"
import { ReadingProgress } from "@/components/quran/ReadingProgress"
import { AyahSkeleton } from "@/components/quran/AyahSkeleton"
import { ErrorState } from "@/components/quran/ErrorState"
import { EmptyState } from "@/components/quran/EmptyState"
import { Button } from "@/components/ui/button"
import { RippleButton } from "@/components/ui/RippleButton"
import { useBookmarkStore } from "@/store/bookmarkStore"
import { useFavoriteStore } from "@/store/favoriteStore"
import { useHighlightStore } from "@/store/highlightStore"
import { useProgressStore } from "@/store/progressStore"
import { useReaderStore } from "@/store/readerStore"
import { useAudioPlayerStore } from "@/store/audioPlayerStore"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { Surah, Ayah, Translation } from "@/types"

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

const RECITERS = [
  { id: "mishaari_raashid_al_3afaasee", name: "Mishary Alafasy", country: "Kuwait" },
  { id: "abdurrahmaan_as-sudays", name: "Abdul Rahman Al-Sudais", country: "Saudi Arabia" },
  { id: "sa3d_al-ghaamidi", name: "Saad Al Ghamidi", country: "Saudi Arabia" },
]

const TRANSLATIONS = [
  { value: "en.asad", label: "English (Muhammad Asad)", lang: "en" },
  { value: "ur.jalandhry", label: "Urdu (Mahmood ul Hassan)", lang: "ur" },
  { value: "en.pickthall", label: "English (Pickthall)", lang: "en" },
  { value: "en.yusufali", label: "English (Yusuf Ali)", lang: "en" },
  { value: "en.sahih", label: "English (Saheeh International)", lang: "en" },
]

interface ApiEdition {
  edition: { identifier: string; language: string; name: string }
  ayahs: ApiAyah[]
}

interface ApiAyah {
  number: number
  text: string
  numberInSurah: number
  juz: number
  manzil: number
  page: number
  hizbQuarter: number
  sajda: boolean
}

interface ApiEditionsResponse {
  code: number
  status: string
  data: ApiEdition[]
}

const pad = (n: number) => String(n).padStart(3, "0")

function getPad(n: number): string {
  if (n <= 9) return `00${n}`
  if (n <= 99) return `0${n}`
  return String(n)
}

export default function SurahPage() {
  const params = useParams()
  const surahNumber = parseInt(params.surahNumber as string, 10)

  const router = useRouter()
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => { if (surahNumber < 114) router.push(`/surahs/${surahNumber + 1}`) },
    onSwipeRight: () => { if (surahNumber > 1) router.push(`/surahs/${surahNumber - 1}`) },
  })

  const [surah, setSurah] = useState<Surah | null>(null)
  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [englishTranslations, setEnglishTranslations] = useState<Record<string, Translation>>({})
  const [urduTranslations, setUrduTranslations] = useState<Record<string, Translation>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0])
  const [reciterOpen, setReciterOpen] = useState(false)

  const surahAudioUrl = `https://download.quranicaudio.com/quran/${selectedReciter.id}/${getPad(surahNumber)}.mp3`

  const bookmarks = useBookmarkStore((s) => s.bookmarks)
  const addBookmark = useBookmarkStore((s) => s.addBookmark)
  const removeBookmark = useBookmarkStore((s) => s.removeBookmark)
  const favorites = useFavoriteStore((s) => s.favorites)
  const toggleFavorite = useFavoriteStore((s) => s.toggleFavorite)
  const { toggleHighlight } = useHighlightStore()
  const { translationLanguage, setTranslationLanguage } = useReaderStore()
  const { currentTrack, isPlaying, isLoading, setTrack, togglePlay } = useAudioPlayerStore()

  const isCurrentTrack = currentTrack?.surahNumber === surahNumber && currentTrack?.ayahNumber === 1

  const handlePlaySurah = () => {
    if (isCurrentTrack) {
      togglePlay()
    } else {
      setTrack({
        surahNumber,
        ayahNumber: 1,
        surahName: surah?.nameSimple || surah?.nameArabic || `Surah ${surahNumber}`,
        audioUrl: surahAudioUrl,
        reciterName: selectedReciter.name,
      })
    }
  }

  const fetchSurah = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const editionsRes = await fetch(
        `${ALQURAN_API}/surah/${surahNumber}/editions/quran-uthmani,en.asad,ur.jalandhry,en.pickthall,en.yusufali,en.sahih`
      )
      const editionsJson: ApiEditionsResponse = await editionsRes.json()

      if (editionsJson.code !== 200 || !Array.isArray(editionsJson.data)) {
        throw new Error("Invalid API response")
      }

      const editions = editionsJson.data
      const uthmani = editions.find((e) => e.edition.identifier === "quran-uthmani")

      if (!uthmani?.ayahs?.length) {
        throw new Error("No ayah data received")
      }

      const apiAyahs = uthmani.ayahs
      const surahInfo: Surah = {
        surahNumber,
        nameArabic: ARABIC_NAMES[surahNumber] || "",
        nameSimple: "",
        nameEnglish: "",
        revelationType: "Meccan",
        totalAyahs: apiAyahs.length,
      }

      if (apiAyahs.length > 0) {
        const surahMetaRes = await fetch(`${ALQURAN_API}/surah/${surahNumber}`)
        const surahMetaJson = await surahMetaRes.json()
        if (surahMetaJson.code === 200 && surahMetaJson.data) {
          const d = surahMetaJson.data
          surahInfo.nameArabic = ARABIC_NAMES[surahNumber] || d.name
          surahInfo.nameSimple = d.englishName
          surahInfo.nameEnglish = d.englishNameTranslation
          surahInfo.revelationType = d.revelationType
          surahInfo.totalAyahs = d.numberOfAyahs
        }
      }

      setSurah(surahInfo)

      const mappedAyahs: Ayah[] = apiAyahs.map((a: ApiAyah) => ({
        surahNumber,
        ayahNumber: a.numberInSurah,
        textArabic: a.text,
        juz: a.juz,
        manzil: a.manzil,
        page: a.page,
        hizb: Math.ceil(a.hizbQuarter / 4) || 1,
        rubElHizb: a.hizbQuarter || 1,
        sajda: !!a.sajda,
      }))
      setAyahs(mappedAyahs)

      const allTranslations: Record<string, Translation[]> = {}
      editions
        .filter((e) => e.edition.identifier !== "quran-uthmani" && e.ayahs?.length)
        .forEach((e) => {
          e.ayahs.forEach((a: ApiAyah, idx: number) => {
            const ayahNum = a.numberInSurah || apiAyahs[idx]?.numberInSurah || (idx + 1)
            const key = `${surahNumber}:${ayahNum}`
            if (!allTranslations[key]) allTranslations[key] = []
            allTranslations[key].push({
              surahNumber,
              ayahNumber: ayahNum,
              language: e.edition.language,
              translator: e.edition.name,
              translationEdition: e.edition.identifier,
              text: a.text,
            })
          })
        })

      const enMap: Record<string, Translation> = {}
      const urMap: Record<string, Translation> = {}
      Object.values(allTranslations).forEach((transList) => {
        transList.forEach((t) => {
          const key = `${t.surahNumber}:${t.ayahNumber}`
          if (t.language === "ur") urMap[key] = t
          else enMap[key] = t
        })
      })
      setEnglishTranslations(enMap)
      setUrduTranslations(urMap)
    } catch {
      setError("Failed to load surah data. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [surahNumber])

  useEffect(() => { fetchSurah() }, [fetchSurah])

  useEffect(() => {
    if (surah) {
      document.title = `${surah.nameSimple || `Surah ${surahNumber}`} - Surah ${surahNumber} | Quran Audio`
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        metaDesc.setAttribute(
          "content",
          `Read Surah ${surah.nameSimple || ""} (${surah.nameArabic}) - ${surah.totalAyahs} verses, ${surah.revelationType}. Arabic text with translations and audio recitation.`
        )
      }
    }
  }, [surah, surahNumber])

  function getPrimaryTranslation(ayahNumber: number): Translation | undefined {
    if (translationLanguage === "off") return undefined
    if (translationLanguage === "ur") return urduTranslations[`${surahNumber}:${ayahNumber}`]
    return englishTranslations[`${surahNumber}:${ayahNumber}`]
  }

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="space-y-6">
          <div className="h-56 animate-pulse rounded-2xl bg-gradient-to-br from-islamic-green/5 to-islamic-gold/5" />
          <AyahSkeleton />
        </div>
      </div>
    )
  }

  if (error || !surah) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 max-w-3xl mx-auto">
        <ErrorState message={error || "Surah not found"} onRetry={fetchSurah} />
      </div>
    )
  }

  if (ayahs.length === 0) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 max-w-3xl mx-auto">
        <EmptyState title="No verses found" description="This surah has no verses loaded." />
      </div>
    )
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 max-w-3xl mx-auto" {...swipeHandlers}>
      <div className="space-y-5">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-islamic-green/[0.06] via-transparent to-islamic-gold/[0.04] p-6 md:p-8"
        >
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #0B6B3A 0%, transparent 50%)`,
          }} />
          <div className="relative flex flex-col items-center text-center space-y-4">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-islamic-green to-islamic-green-dark flex items-center justify-center shadow-lg shadow-islamic-green/20">
              <span className="text-3xl font-bold text-white">{surah.surahNumber}</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-amiri text-islamic-green-dark dark:text-islamic-green/90" dir="rtl">
                {surah.nameArabic}
              </h1>
              <h2 className="text-xl font-semibold mt-1">{surah.nameSimple}</h2>
              <p className="text-sm text-muted-foreground italic mt-0.5">{surah.nameEnglish}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-islamic-gold" />
                {surah.revelationType}
              </span>
              <span className="flex items-center gap-1.5">
                <Book className="h-4 w-4 text-islamic-gold" />
                {surah.totalAyahs} verses
              </span>
            </div>

            {/* Reciter Selector */}
            <div className="relative w-full max-w-xs">
              <button
                onClick={() => setReciterOpen(!reciterOpen)}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card/60 text-sm hover:border-islamic-green/30 transition-all"
              >
                <User className="h-4 w-4 text-islamic-green shrink-0" />
                <span className="flex-1 text-left truncate">{selectedReciter.name}</span>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", reciterOpen && "rotate-180")} />
              </button>
              {reciterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-1 left-0 right-0 bg-card border border-border/60 rounded-xl shadow-soft overflow-hidden z-10"
                >
                  {RECITERS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => { setSelectedReciter(r); setReciterOpen(false) }}
                      className={cn(
                        "w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted transition-colors",
                        r.id === selectedReciter.id && "bg-islamic-green/5 text-islamic-green font-medium"
                      )}
                    >
                      <span className="h-6 w-6 rounded-full bg-gradient-to-br from-islamic-green to-islamic-gold flex items-center justify-center text-white text-[10px] font-bold">
                        {r.name.charAt(0)}
                      </span>
                      <div className="text-left">
                        <p className="text-sm">{r.name}</p>
                        <p className="text-[10px] text-muted-foreground">{r.country}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Play button */}
            <RippleButton
              variant="primary"
              size="md"
              className={cn(
                "gap-2 rounded-full px-6 shadow-md transition-all h-11",
                isCurrentTrack && isPlaying && "animate-glow"
              )}
              onClick={handlePlaySurah}
            >
              {isCurrentTrack && isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-islamic-spin" />
                  <span>Loading...</span>
                </>
              ) : isCurrentTrack && isPlaying ? (
                <>
                  <div className="wave-bars">
                    <span className="bg-white" /><span className="bg-white" /><span className="bg-white" /><span className="bg-white" /><span className="bg-white" />
                  </div>
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" />
                  <span>Play Full Surah</span>
                </>
              )}
            </RippleButton>

            {/* Translation selector */}
            <div className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="flex rounded-lg border border-border/60 overflow-hidden">
                {(["off", "en", "ur"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setTranslationLanguage(lang)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium transition-all",
                      translationLanguage === lang
                        ? "bg-islamic-green text-white"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {lang === "off" ? "Off" : lang === "en" ? "English" : "Urdu"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bismillah */}
        {surahNumber !== 9 && surahNumber !== 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-6 glass-premium rounded-2xl border border-islamic-green/10"
          >
            <p className="text-2xl md:text-3xl font-amiri text-islamic-green-dark dark:text-islamic-green/90 leading-relaxed" dir="rtl">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <p className="text-xs text-muted-foreground mt-2 italic">
              In the Name of Allah, the Most Gracious, the Most Merciful
            </p>
          </motion.div>
        )}

        <FontControls />
        <ReadingProgress
          surahNumber={surahNumber}
          totalAyahs={surah.totalAyahs}
          currentAyah={ayahs[ayahs.length - 1]?.ayahNumber || 1}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {ayahs.map((ayah) => {
            const primary = getPrimaryTranslation(ayah.ayahNumber)
            return (
              <AyahCard
                key={`${ayah.surahNumber}:${ayah.ayahNumber}`}
                ayah={ayah}
                surahName={surah.nameSimple}
                translation={primary}
                audioUrl={surahAudioUrl}
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
            )
          })}
        </motion.div>

        <div className="py-8 text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-islamic-green/10 to-islamic-gold/10 mb-4">
            <Book className="h-6 w-6 text-islamic-green" />
          </div>
          <p className="text-sm text-muted-foreground">
            End of Surah {surah.nameSimple || surah.nameArabic}
          </p>
          <p className="text-3xl mt-3 text-islamic-green/80" dir="rtl">
            &#xFDFD;
          </p>
        </div>
      </div>
    </div>
  )
}
