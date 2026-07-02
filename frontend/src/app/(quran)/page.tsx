"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  BookMarked,
  Star,
  Bot,
  Search,
  Clock,
  ArrowRight,
  Sparkles,
  BookText,
  Library,
  Headphones,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProgressStore } from "@/store/progressStore"
import { useAuthStore } from "@/store/authStore"
import { cn } from "@/lib/utils"

const quickLinks = [
  {
    href: "/surahs",
    label: "Surahs",
    desc: "Browse all 114 surahs",
    icon: BookOpen,
    gradient: "from-islamic-green to-islamic-green-dark",
    shadow: "shadow-islamic-green/20",
  },
  {
    href: "/juz",
    label: "Juz",
    desc: "Read by Juz division",
    icon: BookMarked,
    gradient: "from-islamic-gold to-amber-600",
    shadow: "shadow-amber-500/20",
  },
  {
    href: "/reciters",
    label: "Reciters",
    desc: "Listen to your favorite reciters",
    icon: Headphones,
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
  },
  {
    href: "/ai",
    label: "AI Assistant",
    desc: "Ask questions & learn",
    icon: Bot,
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/20",
  },
]

const features = [
  {
    icon: Library,
    label: "Bookmarks",
    href: "/bookmarks",
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    icon: Star,
    label: "Favorites",
    href: "/favorites",
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-100 dark:bg-pink-900/30",
  },
  {
    icon: Clock,
    label: "History",
    href: "/history",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    icon: BookText,
    label: "Dashboard",
    href: "/dashboard",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
]

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { isAuthenticated } = useAuthStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/surahs?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push("/surahs")
    }
  }

  const { getContinueReading } = useProgressStore.getState()
  const [continueReading, setContinueReading] = useState<{
    surahNumber: number
    ayahNumber: number
    percentage?: number
  } | null>(null)

  useEffect(() => {
    const reading = getContinueReading()
    if (reading) setContinueReading(reading)
  }, [getContinueReading])

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-islamic-green/[0.03] via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #0B6B3A 0%, transparent 50%), radial-gradient(circle at 80% 20%, #B8860B 0%, transparent 50%)",
          }}
        />
        <div className="relative px-4 pt-16 pb-12 md:pt-24 md:pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-islamic-green/20 bg-islamic-green/5 px-4 py-1.5 text-xs font-medium text-islamic-green">
              <Sparkles className="h-3.5 w-3.5" />
              Your Complete Quran Companion
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Read the Quran, Listen with Heart,{" "}
              <span className="bg-gradient-to-r from-islamic-green via-islamic-green-dark to-islamic-gold bg-clip-text text-transparent">
                Live by Its Guidance.
              </span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto">
              The Holy Quran with authentic recitations, translations, and
              powerful tools to deepen your connection with the Book of Allah.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search surah by name or number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-12 rounded-2xl border-border/60 bg-card/70 text-base shadow-sm backdrop-blur-sm focus-visible:border-islamic-green/50 focus-visible:ring-1 focus-visible:ring-islamic-green/20"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 rounded-xl bg-islamic-green hover:bg-islamic-green-dark text-white gap-1.5"
                >
                  <span className="hidden sm:inline">Search</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Continue Reading */}
      {continueReading && (
        <section className="px-4 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <Link href={`/surahs/${continueReading.surahNumber}`}>
              <div className="group relative overflow-hidden rounded-2xl border border-islamic-green/20 bg-gradient-to-r from-islamic-green/5 via-card to-islamic-gold/5 p-5 transition-all hover:border-islamic-green/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-islamic-green/10 to-islamic-gold/10">
                      <BookOpen className="h-6 w-6 text-islamic-green" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Continue Reading
                      </p>
                      <p className="text-base font-semibold mt-0.5">
                        Surah {continueReading.surahNumber} &mdash; Ayah{" "}
                        {continueReading.ayahNumber}
                      </p>
                      {continueReading.percentage != null &&
                        continueReading.percentage > 0 && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-islamic-green to-islamic-gold transition-all"
                                style={{
                                  width: `${continueReading.percentage}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {continueReading.percentage}%
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-islamic-green" />
                </div>
              </div>
            </Link>
          </motion.div>
        </section>
      )}

      {/* Quick Links Grid */}
      <section className="px-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link, i) => {
              const Icon = link.icon
              return (
                <Link key={link.href} href={link.href}>
                  <div
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 transition-all hover:shadow-lg hover:-translate-y-0.5",
                      `hover:${link.shadow}`
                    )}
                  >
                    <div
                      className={cn(
                        "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm transition-transform group-hover:scale-105",
                        link.gradient
                      )}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold">{link.label}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {link.desc}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      {isAuthenticated && (
        <section className="px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-lg font-semibold mb-3 text-center md:text-left">
              Your Library
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <Link key={feature.href} href={feature.href}>
                    <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card/40 p-4 transition-all hover:border-islamic-green/30 hover:bg-card/80 hover:shadow-sm">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl",
                          feature.bg
                        )}
                      >
                        <Icon className={cn("h-5 w-5", feature.color)} />
                      </div>
                      <span className="text-xs font-medium">
                        {feature.label}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="px-4 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-islamic-green/[0.04] via-card to-islamic-gold/[0.04] border border-islamic-green/20 p-6 md:p-8 text-center">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, #0B6B3A 0%, transparent 50%)",
              }}
            />
            <div className="relative">
              <p className="text-2xl md:text-3xl font-amiri text-islamic-green-dark dark:text-islamic-green/90 leading-relaxed" dir="rtl">
                رَبَّنَا آمَنَّا بِمَا أَنزَلْتَ وَاتَّبَعْنَا الرَّسُولَ
              </p>
              <p className="text-sm text-muted-foreground mt-3 italic">
                &ldquo;Our Lord, we have believed in what You revealed and have
                followed the messenger.&rdquo;
              </p>
              <p className="text-xs text-islamic-gold mt-2">
                Qur&rsquo;an 3:53
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
