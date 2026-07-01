import Ayah, { IAyah } from "../models/Ayah"
import { ApiFeatures } from "../utils/apiFeatures"

export class AyahService {
  async findAll(queryParams: Record<string, string | undefined>) {
    const apiFeatures = new ApiFeatures<IAyah>(Ayah, queryParams)
    apiFeatures.setSearchFields(["textArabic", "textSimple"])
    return apiFeatures.execute()
  }

  async findById(id: string) {
    const ayah = await Ayah.findById(id)
    if (!ayah) throw new Error("Ayah not found")
    return ayah
  }

  async findBySurah(surahNumber: number, queryParams: Record<string, string | undefined>) {
    const apiFeatures = new ApiFeatures<IAyah>(Ayah, {
      ...queryParams,
      surahNumber: String(surahNumber),
    })
    return apiFeatures.execute()
  }

  async findByJuz(juz: number, queryParams: Record<string, string | undefined>) {
    const apiFeatures = new ApiFeatures<IAyah>(Ayah, {
      ...queryParams,
      juz: String(juz),
    })
    return apiFeatures.execute()
  }

  async findByPage(page: number, queryParams: Record<string, string | undefined>) {
    const ayahs = await Ayah.find({ page })
      .sort({ surahNumber: 1, ayahNumber: 1 })
      .skip(0)
      .limit(100)
    const total = await Ayah.countDocuments({ page })
    return {
      data: ayahs,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: total,
        itemsPerPage: 100,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  }

  async findOneAyah(surahNumber: number, ayahNumber: number) {
    const ayah = await Ayah.findOne({ surahNumber, ayahNumber })
    if (!ayah) throw new Error("Ayah not found")
    return ayah
  }

  async getSajdaAyahs() {
    return Ayah.find({ sajda: true })
      .select("surahNumber ayahNumber sajdaNumber textArabic")
      .sort({ surahNumber: 1, ayahNumber: 1 })
  }
}
