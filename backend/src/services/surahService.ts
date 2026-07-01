import Surah, { ISurah } from "../models/Surah"
import { ApiFeatures } from "../utils/apiFeatures"

export class SurahService {
  async findAll(queryParams: Record<string, string | undefined>) {
    const apiFeatures = new ApiFeatures<ISurah>(Surah, queryParams)
    return apiFeatures.execute()
  }

  async findById(id: string) {
    const surah = await Surah.findById(id)
    if (!surah) throw new Error("Surah not found")
    return surah
  }

  async findByNumber(surahNumber: number) {
    const surah = await Surah.findOne({ surahNumber })
    if (!surah) throw new Error("Surah not found")
    return surah
  }

  async getSurahSummary() {
    return Surah.find({})
      .select("surahNumber nameArabic nameSimple nameEnglish revelationType totalAyahs")
      .sort({ surahNumber: 1 })
  }

  async getJuzList() {
    const surahs = await Surah.find({}, { surahNumber: 1, nameSimple: 1, juz: 1, _id: 0 })
      .sort({ surahNumber: 1 })
    const juzMap: Record<number, { surahNumber: number; name: string; ayahStart: number; ayahEnd: number }[]> = {}
    for (const s of surahs) {
      for (const j of s.juz) {
        if (!juzMap[j.juzNumber]) juzMap[j.juzNumber] = []
        juzMap[j.juzNumber].push({
          surahNumber: s.surahNumber,
          name: s.nameSimple,
          ayahStart: j.ayahStart,
          ayahEnd: j.ayahEnd,
        })
      }
    }
    return Object.entries(juzMap)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([juz, surahs]) => ({ juz: parseInt(juz), surahs }))
  }
}
