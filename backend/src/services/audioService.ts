import Audio, { IAudio } from "../models/Audio"
import { ApiFeatures } from "../utils/apiFeatures"

export class AudioService {
  async findAll(queryParams: Record<string, string | undefined>) {
    const apiFeatures = new ApiFeatures<IAudio>(Audio, queryParams)
    return apiFeatures.execute()
  }

  async findBySurah(surahNumber: number, queryParams: Record<string, string | undefined>) {
    const apiFeatures = new ApiFeatures<IAudio>(Audio, {
      ...queryParams,
      surahNumber: String(surahNumber),
    })
    return apiFeatures.execute()
  }

  async findByReciter(reciterId: string, queryParams: Record<string, string | undefined>) {
    const apiFeatures = new ApiFeatures<IAudio>(Audio, {
      ...queryParams,
      reciterId,
    })
    return apiFeatures.execute()
  }

  async getReciters() {
    return Audio.distinct("reciter")
  }

  async getReciterList() {
    return Audio.aggregate([
      { $group: { _id: "$reciterId", name: { $first: "$reciter" }, count: { $sum: 1 } } },
      { $project: { _id: 0, reciterId: "$_id", name: 1, count: 1 } },
      { $sort: { name: 1 } },
    ])
  }
}
