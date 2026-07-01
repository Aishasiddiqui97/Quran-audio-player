export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  isVerified: boolean
  createdAt?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiError {
  message: string
  stack?: string
}

export interface Surah {
  _id?: string
  surahNumber: number
  nameArabic: string
  nameSimple: string
  nameEnglish: string
  revelationType: "Meccan" | "Medinan"
  totalAyahs: number
  juz?: { juzNumber: number; ayahStart: number; ayahEnd: number }[]
  audioUrl?: string
}

export interface Ayah {
  _id?: string
  surahNumber: number
  ayahNumber: number
  textArabic: string
  textSimple?: string
  juz?: number
  hizb?: number
  rubElHizb?: number
  sajda?: boolean
  sajdaNumber?: number
  page?: number
  manzil?: number
}

export interface Translation {
  _id?: string
  surahNumber: number
  ayahNumber: number
  language: string
  translator: string
  translationEdition: string
  text: string
}

export interface WordByWord {
  _id: string
  surahNumber: number
  ayahNumber: number
  wordNumber: number
  arabic: string
  translation: string
  transliteration: string
}

export interface Tafsir {
  _id: string
  surahNumber: number
  ayahNumber: number
  source: string
  language: string
  text: string
}

export interface Audio {
  _id: string
  surahNumber: number
  ayahNumber: number
  reciter: string
  reciterId: string
  audioUrl: string
  duration: number
}

export interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

export interface Bookmark {
  surahNumber: number
  ayahNumber: number
  timestamp: number
  note?: string
}

export interface Favorite {
  surahNumber: number
  ayahNumber: number
  timestamp: number
}

export interface Highlight {
  surahNumber: number
  ayahNumber: number
  color: string
  timestamp: number
}

export interface VerseNote {
  surahNumber: number
  ayahNumber: number
  text: string
  timestamp: number
}

export interface ReadingProgress {
  surahNumber: number
  ayahNumber: number
  timestamp: number
  percentage: number
}

export type AIFeature = "ask" | "explain" | "topics" | "reflection" | "quiz" | "memorize"

export interface AIMessage {
  role: "user" | "assistant"
  content: string
  timestamp: number
  metadata?: Record<string, unknown>
}

export interface Conversation {
  _id: string
  userId: string
  title: string
  messages: AIMessage[]
  feature: AIFeature
  createdAt: string
  updatedAt: string
}

export interface ConversationListItem {
  _id: string
  title: string
  feature: AIFeature
  updatedAt: string
  createdAt: string
}

export interface AIResponse {
  content: string
  metadata?: Record<string, unknown>
  conversationId?: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}
