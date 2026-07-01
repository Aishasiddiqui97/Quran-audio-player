import WordByWord, { IWordByWord } from "../models/WordByWord"
import { ApiFeatures } from "../utils/apiFeatures"

export class WordByWordService {
  async findAll(queryParams: Record<string, string | undefined>) {
    const apiFeatures = new ApiFeatures<IWordByWord>(WordByWord, queryParams)
    apiFeatures.setSearchFields(["arabic", "translation", "transliteration"])
    return apiFeatures.execute()
  }

  async findByAyah(surahNumber: number, ayahNumber: number) {
    const words = await WordByWord.find({ surahNumber, ayahNumber })
      .sort({ wordNumber: 1 })
    return words
  }

  async findBySurah(surahNumber: number, queryParams: Record<string, string | undefined>) {
    const apiFeatures = new ApiFeatures<IWordByWord>(WordByWord, {
      ...queryParams,
      surahNumber: String(surahNumber),
    })
    return apiFeatures.execute()
  }
}
