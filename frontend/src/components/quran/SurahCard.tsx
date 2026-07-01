"use client"

import { memo } from "react"
import Link from "next/link"
import { Book, MapPin } from "lucide-react"
import type { Surah } from "@/types"
import { cn } from "@/lib/utils"

interface SurahCardProps {
  surah: Surah
  index: number
}

export const SurahCard = memo(function SurahCard({ surah, index }: SurahCardProps) {
  return (
    <Link
      href={`/surahs/${surah.surahNumber}`}
      className="group block rounded-lg border bg-card p-4 transition-all hover:shadow-md hover:border-primary/50 active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {surah.surahNumber}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
            {surah.nameSimple}
          </h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {surah.revelationType}
            </span>
            <span className="flex items-center gap-1">
              <Book className="h-3 w-3" />
              {surah.totalAyahs} verses
            </span>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <span
            className={cn(
              "text-2xl font-arabic leading-relaxed",
              surah.surahNumber === 9 || surah.surahNumber === 1
                ? "text-3xl"
                : "text-2xl"
            )}
            dir="rtl"
          >
            {surah.nameArabic}
          </span>
        </div>
      </div>
    </Link>
  )
})
