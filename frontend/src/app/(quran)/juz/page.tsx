"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { BookMarked, BookOpen, ChevronRight, Sparkles } from "lucide-react"
import { useProgressStore } from "@/store/progressStore"
import { cn } from "@/lib/utils"

const JUZ_NAMES: Record<number, { name: string; ayahs: number; surahs: string }> = {
  1: { name: "Alif Lam Meem", ayahs: 148, surahs: "Al-Fatiha (1) – Al-Baqarah (2)" },
  2: { name: "Sayaqool", ayahs: 111, surahs: "Al-Baqarah (2)" },
  3: { name: "Tilka Ar-Rusulu", ayahs: 126, surahs: "Al-Baqarah (2)" },
  4: { name: "Kullu Ta'am", ayahs: 131, surahs: "Al-Baqarah (2) – Aal-e-Imran (3)" },
  5: { name: "Wal-Muhsanat", ayahs: 124, surahs: "An-Nisa (4)" },
  6: { name: "La Yuhibbullah", ayahs: 110, surahs: "An-Nisa (4) – Al-Ma'idah (5)" },
  7: { name: "Wa Iza Samiu", ayahs: 149, surahs: "Al-Ma'idah (5) – Al-An'am (6)" },
  8: { name: "Wa Law Annana", ayahs: 142, surahs: "Al-An'am (6) – Al-A'raf (7)" },
  9: { name: "Qaalal Mala'u", ayahs: 159, surahs: "Al-A'raf (7) – Al-Anfal (8)" },
  10: { name: "Wa A'lamu", ayahs: 127, surahs: "Al-Anfal (8) – At-Tawba (9)" },
  11: { name: "Yatazeroon", ayahs: 151, surahs: "At-Tawba (9) – Yunus (10)" },
  12: { name: "Wa Ma Min Da'bbah", ayahs: 170, surahs: "Hud (11) – Yusuf (12)" },
  13: { name: "Wa Ma Ubri'u", ayahs: 154, surahs: "Yusuf (12) – Ibrahim (14)" },
  14: { name: "Rubama", ayahs: 227, surahs: "Al-Hijr (15) – An-Nahl (16)" },
  15: { name: "Subhanalladhi", ayahs: 185, surahs: "Al-Isra (17) – Al-Kahf (18)" },
  16: { name: "Qal Alam", ayahs: 269, surahs: "Maryam (19) – Ta-Ha (20)" },
  17: { name: "Iqtaraba", ayahs: 190, surahs: "Al-Anbiya (21) – Al-Hajj (22)" },
  18: { name: "Qad Aflaha", ayahs: 202, surahs: "Al-Mu'minun (23) – An-Nur (24)" },
  19: { name: "Wa Qalal Ladheena", ayahs: 339, surahs: "Al-Furqan (25) – An-Naml (27)" },
  20: { name: "A'man Khalaqa", ayahs: 171, surahs: "An-Naml (27) – Al-Ankabut (29)" },
  21: { name: "Utlu Ma Oohiya", ayahs: 178, surahs: "Al-Ankabut (29) – Al-Ahzab (33)" },
  22: { name: "Wa Man Yaqnut", ayahs: 169, surahs: "Al-Ahzab (33) – Ya-Sin (36)" },
  23: { name: "Wa Ma Liya", ayahs: 357, surahs: "Ya-Sin (36) – Az-Zumar (39)" },
  24: { name: "Faman Azlam", ayahs: 175, surahs: "Az-Zumar (39) – Fussilat (41)" },
  25: { name: "Ilahe Yuruddu", ayahs: 246, surahs: "Fussilat (41) – Al-Jathiya (45)" },
  26: { name: "Ha'a Meem", ayahs: 195, surahs: "Al-Ahqaf (46) – Az-Zariyat (51)" },
  27: { name: "Qala Fama Khatbukum", ayahs: 399, surahs: "At-Tur (52) – Al-Hadid (57)" },
  28: { name: "Qadd Sami Allah", ayahs: 137, surahs: "Al-Mujadila (58) – At-Tahrim (66)" },
  29: { name: "Tabarak Alladhi", ayahs: 431, surahs: "Al-Mulk (67) – Al-Mursalat (77)" },
  30: { name: "Amma Yatasa'aloon", ayahs: 564, surahs: "An-Naba (78) – An-Nas (114)" },
}

export default function JuzListingPage() {
  const { progress } = useProgressStore()

  const juzProgress = useMemo(() => {
    const map: Record<number, number> = {}
    progress.forEach((p) => {
      const juzNum = p.surahNumber <= 1 ? 1 : Math.min(30, Math.ceil((p.surahNumber * 30) / 114))
      map[juzNum] = Math.max(map[juzNum] || 0, p.percentage)
    })
    return map
  }, [progress])

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-islamic-green/20 to-islamic-gold/10 flex items-center justify-center">
            <BookMarked className="h-5 w-5 text-islamic-green" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Juz
            </h1>
            <p className="text-sm text-muted-foreground">
              The Quran divided into 30 equal parts
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        {Array.from({ length: 30 }, (_, i) => i + 1).map((juz, idx) => {
          const info = JUZ_NAMES[juz]
          const juzProg = juzProgress[juz] || 0

          return (
            <motion.div
              key={juz}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.025 }}
            >
              <Link
                href={`/juz/${juz}`}
                className={cn(
                  "group block rounded-xl border border-border/50 bg-card p-4",
                  "card-hover-glow transition-all h-full"
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0",
                    "bg-gradient-to-br from-islamic-green to-islamic-green-dark text-white shadow-sm"
                  )}>
                    {juz}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate group-hover:text-islamic-green transition-colors">
                      Juz {juz}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {info.name}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-islamic-green transition-colors shrink-0" />
                </div>

                <p className="text-[10px] text-muted-foreground/60 leading-tight mb-3 line-clamp-1">
                  {info.surahs}
                </p>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
                  <span>{info.ayahs} verses</span>
                  {juzProg > 0 && (
                    <span className="text-islamic-green font-medium">{juzProg}%</span>
                  )}
                </div>

                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${juzProg}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.03 }}
                    className={cn(
                      "h-full rounded-full transition-all",
                      juzProg > 0
                        ? "bg-gradient-to-r from-islamic-green to-islamic-green-dark"
                        : "bg-muted"
                    )}
                  />
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
