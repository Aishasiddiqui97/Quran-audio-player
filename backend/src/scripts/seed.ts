import mongoose from "mongoose"
import axios from "axios"
import Surah from "../models/Surah"
import Ayah from "../models/Ayah"
import Translation from "../models/Translation"
import WordByWord from "../models/WordByWord"
import Tafsir from "../models/Tafsir"
import Audio from "../models/Audio"

const ALQURAN_API = "https://api.alquran.cloud/v1"

interface ApiSurah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  revelationType: "Meccan" | "Medinan"
  numberOfAyahs: number
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

const SURAH_NAMES_ARABIC: Record<number, string> = {
  1: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
  2: "\u0627\u0644\u0628\u0642\u0631\u0629",
  3: "\u0622\u0644 \u0639\u0645\u0631\u0627\u0646",
  4: "\u0627\u0644\u0646\u0633\u0627\u0621",
  5: "\u0627\u0644\u0645\u0627\u0626\u062F\u0629",
  6: "\u0627\u0644\u0623\u0646\u0639\u0627\u0645",
  7: "\u0627\u0644\u0623\u0639\u0631\u0627\u0641",
  8: "\u0627\u0644\u0623\u0646\u0641\u0627\u0644",
  9: "\u0627\u0644\u062A\u0648\u0628\u0629",
  10: "\u064A\u0648\u0646\u0633",
  11: "\u0647\u0648\u062F",
  12: "\u064A\u0648\u0633\u0641",
  13: "\u0627\u0644\u0631\u0639\u062F",
  14: "\u0625\u0628\u0631\u0627\u0647\u064A\u0645",
  15: "\u0627\u0644\u062D\u062C\u0631",
  16: "\u0627\u0644\u0646\u062D\u0644",
  17: "\u0627\u0644\u0625\u0633\u0631\u0627\u0621",
  18: "\u0627\u0644\u0643\u0647\u0641",
  19: "\u0645\u0631\u064A\u0645",
  20: "\u0637\u0647",
  21: "\u0627\u0644\u0623\u0646\u0628\u064A\u0627\u0621",
  22: "\u0627\u0644\u062D\u062C",
  23: "\u0627\u0644\u0645\u0624\u0645\u0646\u0648\u0646",
  24: "\u0627\u0644\u0646\u0648\u0631",
  25: "\u0627\u0644\u0641\u0631\u0642\u0627\u0646",
  26: "\u0627\u0644\u0634\u0639\u0631\u0627\u0621",
  27: "\u0627\u0644\u0646\u0645\u0644",
  28: "\u0627\u0644\u0642\u0635\u0635",
  29: "\u0627\u0644\u0639\u0646\u0643\u0628\u0648\u062A",
  30: "\u0627\u0644\u0631\u0648\u0645",
  31: "\u0644\u0642\u0645\u0627\u0646",
  32: "\u0627\u0644\u0633\u062C\u062F\u0629",
  33: "\u0627\u0644\u0623\u062D\u0632\u0627\u0628",
  34: "\u0633\u0628\u0623",
  35: "\u0641\u0627\u0637\u0631",
  36: "\u064A\u0633",
  37: "\u0627\u0644\u0635\u0627\u0641\u0627\u062A",
  38: "\u0635",
  39: "\u0627\u0644\u0632\u0645\u0631",
  40: "\u063A\u0627\u0641\u0631",
  41: "\u0641\u0635\u0644\u062A",
  42: "\u0627\u0644\u0634\u0648\u0631\u0649",
  43: "\u0627\u0644\u0632\u062E\u0631\u0641",
  44: "\u0627\u0644\u062F\u062E\u0627\u0646",
  45: "\u0627\u0644\u062C\u0627\u062B\u064A\u0629",
  46: "\u0627\u0644\u0623\u062D\u0642\u0627\u0641",
  47: "\u0645\u062D\u0645\u062F",
  48: "\u0627\u0644\u0641\u062A\u062D",
  49: "\u0627\u0644\u062D\u062C\u0631\u0627\u062A",
  50: "\u0642",
  51: "\u0627\u0644\u0630\u0627\u0631\u064A\u0627\u062A",
  52: "\u0627\u0644\u0637\u0648\u0631",
  53: "\u0627\u0644\u0646\u062C\u0645",
  54: "\u0627\u0644\u0642\u0645\u0631",
  55: "\u0627\u0644\u0631\u062D\u0645\u0646",
  56: "\u0627\u0644\u0648\u0627\u0642\u0639\u0629",
  57: "\u0627\u0644\u062D\u062F\u064A\u062F",
  58: "\u0627\u0644\u0645\u062C\u0627\u062F\u0644\u0629",
  59: "\u0627\u0644\u062D\u0634\u0631",
  60: "\u0627\u0644\u0645\u0645\u062A\u062D\u0646\u0629",
  61: "\u0627\u0644\u0635\u0641",
  62: "\u0627\u0644\u062C\u0645\u0639\u0629",
  63: "\u0627\u0644\u0645\u0646\u0627\u0641\u0642\u0648\u0646",
  64: "\u0627\u0644\u062A\u063A\u0627\u0628\u0646",
  65: "\u0627\u0644\u0637\u0644\u0627\u0642",
  66: "\u0627\u0644\u062A\u062D\u0631\u064A\u0645",
  67: "\u0627\u0644\u0645\u0644\u0643",
  68: "\u0627\u0644\u0642\u0644\u0645",
  69: "\u0627\u0644\u062D\u0627\u0642\u0629",
  70: "\u0627\u0644\u0645\u0639\u0627\u0631\u062C",
  71: "\u0646\u0648\u062D",
  72: "\u0627\u0644\u062C\u0646",
  73: "\u0627\u0644\u0645\u0632\u0645\u0644",
  74: "\u0627\u0644\u0645\u062F\u062B\u0631",
  75: "\u0627\u0644\u0642\u064A\u0627\u0645\u0629",
  76: "\u0627\u0644\u0625\u0646\u0633\u0627\u0646",
  77: "\u0627\u0644\u0645\u0631\u0633\u0644\u0627\u062A",
  78: "\u0627\u0644\u0646\u0628\u0623",
  79: "\u0627\u0644\u0646\u0627\u0632\u0639\u0627\u062A",
  80: "\u0639\u0628\u0633",
  81: "\u0627\u0644\u062A\u0643\u0648\u064A\u0631",
  82: "\u0627\u0644\u0627\u0646\u0641\u0637\u0627\u0631",
  83: "\u0627\u0644\u0645\u0637\u0641\u0641\u064A\u0646",
  84: "\u0627\u0644\u0627\u0646\u0634\u0642\u0627\u0642",
  85: "\u0627\u0644\u0628\u0631\u0648\u062C",
  86: "\u0627\u0644\u0637\u0627\u0631\u0642",
  87: "\u0627\u0644\u0623\u0639\u0644\u0649",
  88: "\u0627\u0644\u063A\u0627\u0634\u064A\u0629",
  89: "\u0627\u0644\u0641\u062C\u0631",
  90: "\u0627\u0644\u0628\u0644\u062F",
  91: "\u0627\u0644\u0634\u0645\u0633",
  92: "\u0627\u0644\u0644\u064A\u0644",
  93: "\u0627\u0644\u0636\u062D\u0649",
  94: "\u0627\u0644\u0634\u0631\u062D",
  95: "\u0627\u0644\u062A\u064A\u0646",
  96: "\u0627\u0644\u0639\u0644\u0642",
  97: "\u0627\u0644\u0642\u062F\u0631",
  98: "\u0627\u0644\u0628\u064A\u0646\u0629",
  99: "\u0627\u0644\u0632\u0644\u0632\u0627\u0644",
  100: "\u0627\u0644\u0639\u0627\u062F\u064A\u0627\u062A",
  101: "\u0627\u0644\u0642\u0627\u0631\u0639\u0629",
  102: "\u0627\u0644\u062A\u0643\u0627\u062B\u0631",
  103: "\u0627\u0644\u0639\u0635\u0631",
  104: "\u0627\u0644\u0647\u0645\u0632\u0629",
  105: "\u0627\u0644\u0641\u064A\u0644",
  106: "\u0642\u0631\u064A\u0634",
  107: "\u0627\u0644\u0645\u0627\u0639\u0648\u0646",
  108: "\u0627\u0644\u0643\u0648\u062B\u0631",
  109: "\u0627\u0644\u0643\u0627\u0641\u0631\u0648\u0646",
  110: "\u0627\u0644\u0646\u0635\u0631",
  111: "\u0627\u0644\u0645\u0633\u062F",
  112: "\u0627\u0644\u0625\u062E\u0644\u0627\u0635",
  113: "\u0627\u0644\u0641\u0644\u0642",
  114: "\u0627\u0644\u0646\u0627\u0633",
}

const JZU_DATA: Record<number, { surah: number; start: number; end: number }[]> = {
  1: [{ surah: 1, start: 1, end: 7 }, { surah: 2, start: 1, end: 141 }],
  2: [{ surah: 2, start: 142, end: 252 }],
  3: [{ surah: 2, start: 253, end: 286 }],
  4: [{ surah: 3, start: 1, end: 92 }],
  5: [{ surah: 3, start: 93, end: 200 }, { surah: 4, start: 1, end: 23 }],
  6: [{ surah: 4, start: 24, end: 147 }],
  7: [{ surah: 4, start: 148, end: 176 }],
  8: [{ surah: 5, start: 1, end: 81 }],
  9: [{ surah: 5, start: 82, end: 120 }],
  10: [{ surah: 6, start: 1, end: 110 }],
  11: [{ surah: 6, start: 111, end: 165 }],
  12: [{ surah: 7, start: 1, end: 87 }],
  13: [{ surah: 7, start: 88, end: 206 }],
  14: [{ surah: 8, start: 1, end: 75 }, { surah: 9, start: 1, end: 92 }],
  15: [{ surah: 9, start: 93, end: 129 }],
  16: [{ surah: 10, start: 1, end: 109 }],
  17: [{ surah: 11, start: 1, end: 123 }],
  18: [{ surah: 12, start: 1, end: 111 }],
  19: [{ surah: 13, start: 1, end: 43 }, { surah: 14, start: 1, end: 52 }],
  20: [{ surah: 15, start: 1, end: 99 }],
  21: [{ surah: 16, start: 1, end: 128 }],
  22: [{ surah: 17, start: 1, end: 111 }],
  23: [{ surah: 18, start: 1, end: 110 }],
  24: [{ surah: 19, start: 1, end: 98 }],
  25: [{ surah: 20, start: 1, end: 135 }],
  26: [{ surah: 21, start: 1, end: 112 }],
  27: [{ surah: 22, start: 1, end: 78 }],
  28: [{ surah: 23, start: 1, end: 118 }],
  29: [{ surah: 24, start: 1, end: 64 }],
  30: [{ surah: 25, start: 1, end: 77 }],
  31: [{ surah: 26, start: 1, end: 227 }],
  32: [{ surah: 27, start: 1, end: 93 }],
  33: [{ surah: 28, start: 1, end: 88 }],
  34: [{ surah: 29, start: 1, end: 69 }],
  35: [{ surah: 30, start: 1, end: 60 }],
  36: [{ surah: 31, start: 1, end: 34 }, { surah: 32, start: 1, end: 30 }],
  37: [{ surah: 33, start: 1, end: 73 }],
  38: [{ surah: 34, start: 1, end: 54 }],
  39: [{ surah: 35, start: 1, end: 45 }],
  40: [{ surah: 36, start: 1, end: 83 }],
  41: [{ surah: 37, start: 1, end: 182 }],
  42: [{ surah: 38, start: 1, end: 88 }],
  43: [{ surah: 39, start: 1, end: 75 }],
  44: [{ surah: 40, start: 1, end: 85 }],
  45: [{ surah: 41, start: 1, end: 54 }],
  46: [{ surah: 42, start: 1, end: 53 }],
  47: [{ surah: 43, start: 1, end: 89 }],
  48: [{ surah: 44, start: 1, end: 59 }],
  49: [{ surah: 45, start: 1, end: 37 }],
  50: [{ surah: 46, start: 1, end: 35 }],
  51: [{ surah: 47, start: 1, end: 38 }],
  52: [{ surah: 48, start: 1, end: 29 }],
  53: [{ surah: 49, start: 1, end: 18 }],
  54: [{ surah: 50, start: 1, end: 45 }],
  55: [{ surah: 51, start: 1, end: 60 }],
  56: [{ surah: 52, start: 1, end: 49 }],
  57: [{ surah: 53, start: 1, end: 62 }],
  58: [{ surah: 54, start: 1, end: 55 }],
  59: [{ surah: 55, start: 1, end: 78 }],
  60: [{ surah: 56, start: 1, end: 96 }],
  61: [{ surah: 57, start: 1, end: 29 }],
  62: [{ surah: 58, start: 1, end: 22 }],
  63: [{ surah: 59, start: 1, end: 24 }],
  64: [{ surah: 60, start: 1, end: 13 }],
  65: [{ surah: 61, start: 1, end: 14 }],
  66: [{ surah: 62, start: 1, end: 11 }],
  67: [{ surah: 63, start: 1, end: 11 }],
  68: [{ surah: 64, start: 1, end: 18 }],
  69: [{ surah: 65, start: 1, end: 12 }],
  70: [{ surah: 66, start: 1, end: 12 }],
  71: [{ surah: 67, start: 1, end: 30 }],
  72: [{ surah: 68, start: 1, end: 52 }],
  73: [{ surah: 69, start: 1, end: 52 }],
  74: [{ surah: 70, start: 1, end: 44 }],
  75: [{ surah: 71, start: 1, end: 28 }],
  76: [{ surah: 72, start: 1, end: 28 }],
  77: [{ surah: 73, start: 1, end: 20 }],
  78: [{ surah: 74, start: 1, end: 56 }],
  79: [{ surah: 75, start: 1, end: 40 }],
  80: [{ surah: 76, start: 1, end: 31 }],
  81: [{ surah: 77, start: 1, end: 50 }],
  82: [{ surah: 78, start: 1, end: 40 }],
  83: [{ surah: 79, start: 1, end: 46 }],
  84: [{ surah: 80, start: 1, end: 42 }],
  85: [{ surah: 81, start: 1, end: 29 }],
  86: [{ surah: 82, start: 1, end: 19 }],
  87: [{ surah: 83, start: 1, end: 36 }],
  88: [{ surah: 84, start: 1, end: 25 }],
  89: [{ surah: 85, start: 1, end: 22 }],
  90: [{ surah: 86, start: 1, end: 17 }],
  91: [{ surah: 87, start: 1, end: 19 }],
  92: [{ surah: 88, start: 1, end: 26 }],
  93: [{ surah: 89, start: 1, end: 30 }],
  94: [{ surah: 90, start: 1, end: 20 }],
  95: [{ surah: 91, start: 1, end: 15 }],
  96: [{ surah: 92, start: 1, end: 21 }],
  97: [{ surah: 93, start: 1, end: 11 }],
  98: [{ surah: 94, start: 1, end: 8 }],
  99: [{ surah: 95, start: 1, end: 8 }],
  100: [{ surah: 96, start: 1, end: 19 }],
  101: [{ surah: 97, start: 1, end: 5 }],
  102: [{ surah: 98, start: 1, end: 8 }],
  103: [{ surah: 99, start: 1, end: 8 }],
  104: [{ surah: 100, start: 1, end: 11 }],
  105: [{ surah: 101, start: 1, end: 11 }],
  106: [{ surah: 102, start: 1, end: 8 }],
  107: [{ surah: 103, start: 1, end: 3 }],
  108: [{ surah: 104, start: 1, end: 9 }],
  109: [{ surah: 105, start: 1, end: 5 }],
  110: [{ surah: 106, start: 1, end: 4 }],
  111: [{ surah: 107, start: 1, end: 7 }],
  112: [{ surah: 108, start: 1, end: 3 }],
  113: [{ surah: 109, start: 1, end: 6 }],
  114: [{ surah: 110, start: 1, end: 3 }],
  115: [{ surah: 111, start: 1, end: 5 }],
  116: [{ surah: 112, start: 1, end: 4 }],
  117: [{ surah: 113, start: 1, end: 5 }],
  118: [{ surah: 114, start: 1, end: 6 }],
}

const RECITERS = [
  { id: "ar.abdulbasitmurattal", name: "Abdul Basit (Murattal)" },
  { id: "ar.abdurrahmansudais", name: "Abdur Rahman As-Sudais" },
  { id: "ar.saudalshuraym", name: "Saud Al-Shuraym" },
  { id: "ar.misharyalafasy", name: "Mishary Al-Afasy" },
  { id: "ar.hudhaify", name: "Ali Al-Hudhaify" },
]

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const { data } = await axios.get(url, { timeout: 15000 })
      return data
    } catch (error: any) {
      if (i === retries - 1) throw error
      console.log(`  Retry ${i + 1}/${retries} for ${url}...`)
      await sleep(2000 * (i + 1))
    }
  }
}

async function seedSurahs(apiSurahs: ApiSurah[]) {
  console.log("\n📖 Seeding Surahs...")
  const surahDocs = apiSurahs.map((s) => {
    const juzEntries = []
    for (const [juzNum, entries] of Object.entries(JZU_DATA)) {
      for (const entry of entries) {
        if (entry.surah === s.number) {
          juzEntries.push({
            juzNumber: parseInt(juzNum, 10),
            ayahStart: entry.start,
            ayahEnd: entry.end,
          })
        }
      }
    }
    return {
      surahNumber: s.number,
      nameArabic: SURAH_NAMES_ARABIC[s.number] || s.name,
      nameSimple: s.englishName,
      nameEnglish: s.englishNameTranslation,
      revelationType: s.revelationType,
      totalAyahs: s.numberOfAyahs,
      juz: juzEntries,
    }
  })
  await Surah.insertMany(surahDocs)
  console.log(`  ✅ ${surahDocs.length} Surahs seeded`)
  return surahDocs
}

async function seedAyahs(apiSurahs: ApiSurah[]) {
  console.log("\n📝 Seeding Ayahs...")
  let totalAyahs = 0

  for (const s of apiSurahs) {
    try {
      const response = await fetchWithRetry(`${ALQURAN_API}/surah/${s.number}/editions/quran-uthmani,quran-simple`)
      const editions = response.data

      const uthmaniEdition = editions[0]
      const simpleEdition = editions[1]

      if (!uthmaniEdition?.ayahs || !simpleEdition?.ayahs) {
        console.log(`  ⚠ Surah ${s.number}: No ayah data received`)
        continue
      }

      const ayahDocs = uthmaniEdition.ayahs.map((ayah: any, idx: number) => ({
        surahNumber: s.number,
        ayahNumber: ayah.numberInSurah,
        textArabic: ayah.text,
        textSimple: simpleEdition.ayahs[idx]?.text || ayah.text,
        juz: ayah.juz,
        hizb: Math.ceil(ayah.hizbQuarter / 4) || 1,
        rubElHizb: ayah.hizbQuarter || 1,
        sajda: !!ayah.sajda,
        sajdaNumber: ayah.sajda ? ayah.sajdaNumber || null : undefined,
        page: ayah.page,
        manzil: ayah.manzil || 1,
      }))

      await Ayah.insertMany(ayahDocs)
      totalAyahs += ayahDocs.length
      process.stdout.write(`  Surah ${s.number}/${apiSurahs.length} (${s.englishName}): ${ayahDocs.length} ayahs\n`)
      await sleep(300)
    } catch (error: any) {
      console.log(`  ❌ Surah ${s.number} (${s.englishName}): ${error.message}`)
      continue
    }
  }
  console.log(`  ✅ ${totalAyahs} total Ayahs seeded`)
  return totalAyahs
}

async function seedTranslations(apiSurahs: ApiSurah[]) {
  console.log("\n🌍 Seeding Translations...")
  let totalTranslations = 0

  const editions = [
    { id: "en.sahih", language: "en", translator: "Sahih International" },
    { id: "en.pickthall", language: "en", translator: "Muhammad Pickthall" },
    { id: "en.yusufali", language: "en", translator: "Abdullah Yusuf Ali" },
    { id: "ur.jalandhry", language: "ur", translator: "Mahmood ul Hassan" },
  ]

  for (const edition of editions) {
    console.log(`  Fetching ${edition.translator}...`)
    let editionAyats = 0
    for (const s of apiSurahs) {
      try {
        const response = await fetchWithRetry(`${ALQURAN_API}/surah/${s.number}/${edition.id}`)
        if (!response.data?.ayahs) continue
        const translationDocs = response.data.ayahs.map((ayah: any) => ({
          surahNumber: s.number,
          ayahNumber: ayah.numberInSurah,
          language: edition.language,
          translator: edition.translator,
          translationEdition: edition.id,
          text: ayah.text,
        }))
        await Translation.insertMany(translationDocs)
        editionAyats += translationDocs.length
        await sleep(200)
      } catch {
        continue
      }
    }
    totalTranslations += editionAyats
    console.log(`    ✅ ${edition.translator}: ${editionAyats} ayahs`)
  }
  console.log(`  ✅ ${totalTranslations} total Translations seeded`)
  return totalTranslations
}

async function seedWordByWord(apiSurahs: ApiSurah[]) {
  console.log("\n🔤 Seeding Word-by-Word...")
  let totalWords = 0

  for (const s of apiSurahs) {
    try {
      const response = await fetchWithRetry(`${ALQURAN_API}/surah/${s.number}/quran-uthmani`)
      if (!response.data?.ayahs) continue

      const wordDocs: any[] = []
      for (const ayah of response.data.ayahs) {
        const words = ayah.text.trim().split(/\s+/)
        words.forEach((word: string, idx: number) => {
          wordDocs.push({
            surahNumber: s.number,
            ayahNumber: ayah.numberInSurah,
            wordNumber: idx + 1,
            arabic: word,
            translation: "",
            transliteration: "",
          })
        })
      }
      await WordByWord.insertMany(wordDocs)
      totalWords += wordDocs.length
      process.stdout.write(`  Surah ${s.number}/${apiSurahs.length}: ${wordDocs.length} words\n`)
      await sleep(200)
    } catch {
      continue
    }
  }
  console.log(`  ✅ ${totalWords} total Words seeded`)
  return totalWords
}

async function seedTafsir(apiSurahs: ApiSurah[]) {
  console.log("\n📚 Seeding Tafsir...")
  let totalTafsir = 0
  let tafsirAyats = 0

  for (const s of apiSurahs.slice(0, 10)) {
    try {
      const response = await fetchWithRetry(`${ALQURAN_API}/surah/${s.number}/en.asad`)
      if (!response.data?.ayahs) continue
      const docs = response.data.ayahs.map((ayah: any) => ({
        surahNumber: s.number,
        ayahNumber: ayah.numberInSurah,
        source: "Tafhim-ul-Quran (Asad)",
        language: "en",
        text: ayah.text,
      }))
      await Tafsir.insertMany(docs)
      tafsirAyats += docs.length
      totalTafsir += docs.length
      process.stdout.write(`  Surah ${s.number}: ${docs.length} tafsir entries\n`)
      await sleep(200)
    } catch {
      continue
    }
  }
  console.log(`  ✅ ${totalTafsir} Tafsir entries seeded (first 10 surahs)`)
  return totalTafsir
}

async function seedAudio() {
  console.log("\n🎵 Seeding Audio...")
  let totalAudio = 0

  for (const reciter of RECITERS) {
    const docs: any[] = []
    for (let surahNum = 1; surahNum <= 114; surahNum++) {
      docs.push({
        surahNumber: surahNum,
        ayahNumber: 0,
        reciter: reciter.name,
        reciterId: reciter.id,
        audioUrl: `https://cdn.islamic.network/quran/audio/128/${reciter.id}/${String(surahNum).padStart(3, "0")}.mp3`,
        duration: 0,
      })
    }
    await Audio.insertMany(docs)
    totalAudio += docs.length
    console.log(`  ✅ ${reciter.name}: ${docs.length} surah audio files`)
  }
  console.log(`  ✅ ${totalAudio} total Audio entries seeded`)
  return totalAudio
}

async function main() {
  const startTime = Date.now()
  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/noor-ul-quran"

  console.log("=".repeat(50))
  console.log("🌙 Noor-ul-Quran Database Seeder")
  console.log("=".repeat(50))

  try {
    await mongoose.connect(MONGO_URI)
    console.log(`\n📦 Connected to MongoDB: ${MONGO_URI}`)
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error)
    process.exit(1)
  }

  console.log("\n🗑  Clearing existing Quran collections...")
  await Promise.all([
    Surah.deleteMany({}),
    Ayah.deleteMany({}),
    Translation.deleteMany({}),
    WordByWord.deleteMany({}),
    Tafsir.deleteMany({}),
    Audio.deleteMany({}),
  ])
  console.log("  ✅ All collections cleared")

  console.log("\n📡 Fetching surah list from AlQuranCloud API...")
  let apiSurahs: ApiSurah[]
  try {
    const response = await axios.get(`${ALQURAN_API}/surah`)
    apiSurahs = response.data.data
    console.log(`  ✅ ${apiSurahs.length} surahs fetched from API`)
  } catch (error: any) {
    console.error(`  ❌ Failed to fetch surah list: ${error.message}`)
    process.exit(1)
  }

  const stats = {
    surahs: await seedSurahs(apiSurahs).then((d) => d.length),
    ayahs: await seedAyahs(apiSurahs),
    translations: await seedTranslations(apiSurahs),
    wordByWord: await seedWordByWord(apiSurahs),
    tafsir: await seedTafsir(apiSurahs),
    audio: await seedAudio(),
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log("\n" + "=".repeat(50))
  console.log("✅  SEEDING COMPLETE")
  console.log("=".repeat(50))
  console.log(`   📖 Surahs:       ${stats.surahs}/114`)
  console.log(`   📝 Ayahs:        ${stats.ayahs}`)
  console.log(`   🌍 Translations: ${stats.translations}`)
  console.log(`   🔤 Word-by-Word: ${stats.wordByWord}`)
  console.log(`   📚 Tafsir:       ${stats.tafsir}`)
  console.log(`   🎵 Audio:        ${stats.audio}`)
  console.log(`   ⏱  Duration:     ${duration}s`)
  console.log("=".repeat(50))

  await mongoose.disconnect()
  process.exit(0)
}

main()
