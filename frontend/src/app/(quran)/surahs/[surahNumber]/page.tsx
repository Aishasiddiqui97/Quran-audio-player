"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useSwipe } from "@/hooks/useSwipe"
import { SurahHeader } from "@/components/quran/SurahHeader"
import { AyahCard } from "@/components/quran/AyahCard"
import { FontControls } from "@/components/quran/FontControls"
import { ReadingProgress } from "@/components/quran/ReadingProgress"
import { AyahSkeleton } from "@/components/quran/AyahSkeleton"
import { ErrorState } from "@/components/quran/ErrorState"
import { EmptyState } from "@/components/quran/EmptyState"
import { useBookmarkStore } from "@/store/bookmarkStore"
import { useFavoriteStore } from "@/store/favoriteStore"
import { useHighlightStore } from "@/store/highlightStore"
import { useProgressStore } from "@/store/progressStore"
import { useReaderStore } from "@/store/readerStore"
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

export default function SurahPage() {
  const params = useParams()
  const surahNumber = parseInt(params.surahNumber as string, 10)

  const router = useRouter()
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      if (surahNumber < 114) router.push(`/surahs/${surahNumber + 1}`)
    },
    onSwipeRight: () => {
      if (surahNumber > 1) router.push(`/surahs/${surahNumber - 1}`)
    },
  })

  const [surah, setSurah] = useState<Surah | null>(null)
  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [englishTranslations, setEnglishTranslations] = useState<Record<string, Translation>>({})
  const [urduTranslations, setUrduTranslations] = useState<Record<string, Translation>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const pad = (n: number) => String(n).padStart(3, "0")
  const surahAudioUrl = `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${pad(surahNumber)}.mp3`

  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore()
  const { toggleFavorite, isFavorite } = useFavoriteStore()
  const { toggleHighlight } = useHighlightStore()
  const { translationLanguage } = useReaderStore()

  const fetchSurah = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const editionsRes = await fetch(
        `${ALQURAN_API}/surah/${surahNumber}/editions/quran-uthmani,en.asad,ur.jalandhry`
      )
      const editionsJson: ApiEditionsResponse = await editionsRes.json()

      if (editionsJson.code !== 200 || !Array.isArray(editionsJson.data)) {
        throw new Error("Invalid API response")
      }

      const editions = editionsJson.data
      const uthmani = editions.find((e) => e.edition.identifier === "quran-uthmani")
      const enAsad = editions.find((e) => e.edition.identifier === "en.asad")
      const urJalandhry = editions.find((e) => e.edition.identifier === "ur.jalandhry")

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

      const enMap: Record<string, Translation> = {}
      const urMap: Record<string, Translation> = {}

      if (enAsad?.ayahs) {
        enAsad.ayahs.forEach((a: ApiAyah, idx: number) => {
          const ayahNum = a.numberInSurah || apiAyahs[idx]?.numberInSurah || (idx + 1)
          enMap[`${surahNumber}:${ayahNum}`] = {
            surahNumber,
            ayahNumber: ayahNum,
            language: "en",
            translator: "Muhammad Asad",
            translationEdition: "en.asad",
            text: a.text,
          }
        })
      }
      setEnglishTranslations(enMap)

      if (urJalandhry?.ayahs) {
        urJalandhry.ayahs.forEach((a: ApiAyah, idx: number) => {
          const ayahNum = a.numberInSurah || apiAyahs[idx]?.numberInSurah || (idx + 1)
          urMap[`${surahNumber}:${ayahNum}`] = {
            surahNumber,
            ayahNumber: ayahNum,
            language: "ur",
            translator: "Mahmood ul Hassan",
            translationEdition: "ur.jalandhry",
            text: a.text,
          }
        })
      }
      setUrduTranslations(urMap)
    } catch {
      setError("Failed to load surah data. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [surahNumber])

  useEffect(() => {
    fetchSurah()
  }, [fetchSurah])

  useEffect(() => {
    if (surah) {
      document.title = `${surah.nameSimple || `Surah ${surahNumber}`} - Surah ${surahNumber} | Noor-ul-Quran`
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
    if (translationLanguage === "ur") {
      return urduTranslations[`${surahNumber}:${ayahNumber}`]
    }
    return englishTranslations[`${surahNumber}:${ayahNumber}`]
  }

  function getSecondaryTranslation(ayahNumber: number): Translation | undefined {
    if (translationLanguage === "off") return undefined
    if (translationLanguage === "ur") {
      return englishTranslations[`${surahNumber}:${ayahNumber}`]
    }
    return urduTranslations[`${surahNumber}:${ayahNumber}`]
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="h-48 animate-pulse rounded-xl bg-muted" />
          <AyahSkeleton />
        </div>
      </div>
    )
  }

  if (error || !surah) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState message={error || "Surah not found"} onRetry={fetchSurah} />
      </div>
    )
  }

  if (ayahs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SurahHeader surah={surah} />
        <EmptyState title="No verses found" description="This surah has no verses loaded." />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8" {...swipeHandlers}>
      <div className="mx-auto max-w-3xl space-y-6">
        <SurahHeader surah={surah} />
        <FontControls />
        <ReadingProgress
          surahNumber={surahNumber}
          totalAyahs={surah.totalAyahs}
          currentAyah={ayahs[ayahs.length - 1]?.ayahNumber || 1}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {ayahs.map((ayah, idx) => {
            const primary = getPrimaryTranslation(ayah.ayahNumber)
            const secondary = getSecondaryTranslation(ayah.ayahNumber)
            return (
              <div key={`${ayah.surahNumber}:${ayah.ayahNumber}`}>
                <AyahCard
                  ayah={ayah}
                  surahName={surah.nameSimple}
                  translation={primary}
                  audioUrl={surahAudioUrl}
                  isBookmarked={isBookmarked(ayah.surahNumber, ayah.ayahNumber)}
                  isFavorited={isFavorite(ayah.surahNumber, ayah.ayahNumber)}
                  onToggleBookmark={() => {
                    if (isBookmarked(ayah.surahNumber, ayah.ayahNumber)) {
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

                {secondary && (
                  <div className="px-4 pb-4 -mt-2">
                    <div
                      className="text-sm leading-relaxed text-muted-foreground border-t pt-3"
                      dir={secondary.language === "ur" ? "rtl" : undefined}
                    >
                      {secondary.text}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </motion.div>

        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            End of Surah {surah.nameSimple || surah.nameArabic}
          </p>
          <p className="text-2xl mt-2 text-muted-foreground" dir="rtl" aria-label="Bismillah">
            &#xFDFD;
          </p>
        </div>
      </div>
    </div>
  )
}
