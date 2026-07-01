import mongoose, { Document, Schema } from "mongoose"

export interface ITranslation extends Document {
  surahNumber: number
  ayahNumber: number
  language: string
  translator: string
  translationEdition: string
  text: string
}

const translationSchema = new Schema<ITranslation>(
  {
    surahNumber: { type: Number, required: true, index: true },
    ayahNumber: { type: Number, required: true },
    language: { type: String, required: true, index: true },
    translator: { type: String, required: true },
    translationEdition: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
)

translationSchema.index(
  { surahNumber: 1, ayahNumber: 1, language: 1 },
  { unique: true }
)
translationSchema.index({ text: "text" })

export default mongoose.model<ITranslation>("Translation", translationSchema)
