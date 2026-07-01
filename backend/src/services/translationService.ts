import Translation, { ITranslation } from "../models/Translation"
import { ApiFeatures } from "../utils/apiFeatures"

export class TranslationService {
  async findAll(queryParams: Record<string, string | undefined>) {
    const apiFeatures = new ApiFeatures<ITranslation>(Translation, queryParams)
    apiFeatures.setSearchFields(["text"])
    return apiFeatures.execute()
  }

  async findByAyah(surahNumber: number, ayahNumber: number, queryParams: Record<string, string | undefined>) {
    const apiFeatures = new ApiFeatures<ITranslation>(Translation, {
      ...queryParams,
      surahNumber: String(surahNumber),
      ayahNumber: String(ayahNumber),
    })
    return apiFeatures.execute()
  }

  async findBySurah(surahNumber: number, language: string, queryParams: Record<string, string | undefined>) {
    const apiFeatures = new ApiFeatures<ITranslation>(Translation, {
      ...queryParams,
      surahNumber: String(surahNumber),
      language,
    })
    return apiFeatures.execute()
  }

  async getAvailableEditions() {
    return Translation.distinct("translationEdition")
  }

  async getLanguages() {
    return Translation.distinct("language")
  }
}
