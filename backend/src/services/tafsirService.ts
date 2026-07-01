import Tafsir, { ITafsir } from "../models/Tafsir"
import { ApiFeatures } from "../utils/apiFeatures"

export class TafsirService {
  async findAll(queryParams: Record<string, string | undefined>) {
    const apiFeatures = new ApiFeatures<ITafsir>(Tafsir, queryParams)
    apiFeatures.setSearchFields(["text"])
    return apiFeatures.execute()
  }

  async findByAyah(surahNumber: number, ayahNumber: number) {
    const tafsir = await Tafsir.findOne({ surahNumber, ayahNumber })
    if (!tafsir) throw new Error("Tafsir not found for this ayah")
    return tafsir
  }

  async findBySurah(surahNumber: number, queryParams: Record<string, string | undefined>) {
    const apiFeatures = new ApiFeatures<ITafsir>(Tafsir, {
      ...queryParams,
      surahNumber: String(surahNumber),
    })
    return apiFeatures.execute()
  }

  async getAvailableSources() {
    return Tafsir.distinct("source")
  }
}
