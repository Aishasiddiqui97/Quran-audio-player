import { Request } from "express"
import { IUser } from "../models/User"

export interface AuthRequest extends Request {
  user?: IUser
}

export interface PaginationParams {
  page: number
  limit: number
  skip: number
}

export interface PaginationResult {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ApiQuery {
  filters: Record<string, any>
  sort: Record<string, 1 | -1>
  page: number
  limit: number
  search?: string
  searchFields?: string[]
}

export interface SurahData {
  surahNumber: number
  nameArabic: string
  nameSimple: string
  nameEnglish: string
  revelationType: "Meccan" | "Medinan"
  totalAyahs: number
}

export interface AyahData {
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

export interface SeedStats {
  surahs: number
  ayahs: number
  translations: number
  wordByWord: number
  tafsir: number
  audio: number
  duration: string
}
