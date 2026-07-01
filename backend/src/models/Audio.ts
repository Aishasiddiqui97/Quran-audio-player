import mongoose, { Document, Schema } from "mongoose"

export interface IAudio extends Document {
  surahNumber: number
  ayahNumber: number
  reciter: string
  reciterId: string
  audioUrl: string
  duration: number
}

const audioSchema = new Schema<IAudio>(
  {
    surahNumber: { type: Number, required: true, index: true },
    ayahNumber: { type: Number, required: true },
    reciter: { type: String, required: true },
    reciterId: { type: String, required: true },
    audioUrl: { type: String, required: true },
    duration: { type: Number, default: 0 },
  },
  { timestamps: true }
)

audioSchema.index(
  { surahNumber: 1, ayahNumber: 1, reciterId: 1 },
  { unique: true }
)

export default mongoose.model<IAudio>("Audio", audioSchema)
