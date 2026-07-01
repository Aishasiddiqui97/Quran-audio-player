import mongoose, { Document, Schema } from "mongoose"

export interface IWordByWord extends Document {
  surahNumber: number
  ayahNumber: number
  wordNumber: number
  arabic: string
  translation: string
  transliteration: string
}

const wordByWordSchema = new Schema<IWordByWord>(
  {
    surahNumber: { type: Number, required: true, index: true },
    ayahNumber: { type: Number, required: true },
    wordNumber: { type: Number, required: true },
    arabic: { type: String, required: true },
    translation: { type: String, required: true },
    transliteration: { type: String, default: "" },
  },
  { timestamps: true }
)

wordByWordSchema.index(
  { surahNumber: 1, ayahNumber: 1, wordNumber: 1 },
  { unique: true }
)

export default mongoose.model<IWordByWord>("WordByWord", wordByWordSchema)
