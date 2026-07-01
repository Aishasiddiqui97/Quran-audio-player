import mongoose, { Document, Schema } from "mongoose"

export interface IAyah extends Document {
  surahNumber: number
  ayahNumber: number
  textArabic: string
  textSimple: string
  juz: number
  hizb: number
  rubElHizb: number
  sajda: boolean
  sajdaNumber?: number
  page: number
  manzil: number
}

const ayahSchema = new Schema<IAyah>(
  {
    surahNumber: {
      type: Number,
      required: true,
      index: true,
    },
    ayahNumber: { type: Number, required: true },
    textArabic: { type: String, required: true },
    textSimple: { type: String, required: true },
    juz: { type: Number, required: true, index: true },
    hizb: { type: Number, required: true },
    rubElHizb: { type: Number, required: true },
    sajda: { type: Boolean, default: false },
    sajdaNumber: { type: Number },
    page: { type: Number, required: true },
    manzil: { type: Number, required: true },
  },
  { timestamps: true }
)

ayahSchema.index({ surahNumber: 1, ayahNumber: 1 }, { unique: true })
ayahSchema.index({ juz: 1, ayahNumber: 1 })
ayahSchema.index({ textArabic: "text", textSimple: "text" })

export default mongoose.model<IAyah>("Ayah", ayahSchema)
