import mongoose, { Document, Schema } from "mongoose"

export interface ITafsir extends Document {
  surahNumber: number
  ayahNumber: number
  source: string
  language: string
  text: string
}

const tafsirSchema = new Schema<ITafsir>(
  {
    surahNumber: { type: Number, required: true, index: true },
    ayahNumber: { type: Number, required: true },
    source: { type: String, required: true },
    language: { type: String, required: true, index: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
)

tafsirSchema.index(
  { surahNumber: 1, ayahNumber: 1, source: 1 },
  { unique: true }
)
tafsirSchema.index({ text: "text" })

export default mongoose.model<ITafsir>("Tafsir", tafsirSchema)
