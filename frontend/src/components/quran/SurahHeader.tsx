"use client"

import { motion } from "framer-motion"
import { Book, MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Surah } from "@/types"

interface SurahHeaderProps {
  surah: Surah
}

export function SurahHeader({ surah }: SurahHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary/5 via-background to-primary/5 p-6 md:p-8"
    >
      <Link
        href="/surahs"
        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Surahs
      </Link>

      <div className="flex flex-col items-center text-center space-y-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <span className="text-2xl font-bold text-primary">
            {surah.surahNumber}
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold" dir="rtl">
            {surah.nameArabic}
          </h1>
          <h2 className="text-xl text-muted-foreground mt-1">
            {surah.nameSimple}
          </h2>
          <p className="text-sm text-muted-foreground italic">
            {surah.nameEnglish}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {surah.revelationType}
          </span>
          <span className="flex items-center gap-1">
            <Book className="h-4 w-4" />
            {surah.totalAyahs} verses
          </span>
        </div>
      </div>
    </motion.div>
  )
}
