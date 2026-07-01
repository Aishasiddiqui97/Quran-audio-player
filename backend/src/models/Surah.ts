import mongoose, { Document, Schema } from "mongoose"

export interface ISurah extends Document {
  surahNumber: number
  nameArabic: string
  nameSimple: string
  nameEnglish: string
  revelationType: "Meccan" | "Medinan"
  totalAyahs: number
  juz: { juzNumber: number; ayahStart: number; ayahEnd: number }[]
  audioUrl?: string
}

const surahSchema = new Schema<ISurah>(
  {
    surahNumber: { type: Number, required: true, unique: true, index: true },
    nameArabic: { type: String, required: true },
    nameSimple: { type: String, required: true },
    nameEnglish: { type: String, required: true },
    revelationType: {
      type: String,
      enum: ["Meccan", "Medinan"],
      required: true,
    },
    totalAyahs: { type: Number, required: true },
    juz: [
      {
        juzNumber: { type: Number, required: true },
        ayahStart: { type: Number, required: true },
        ayahEnd: { type: Number, required: true },
        _id: false,
      },
    ],
    audioUrl: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model<ISurah>("Surah", surahSchema)
