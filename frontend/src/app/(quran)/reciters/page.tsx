"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, Headphones, Users, Globe, ChevronRight, Play } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const RECITERS = [
  { id: "mishaari_raashid_al_3afaasee", name: "Mishary Alafasy", country: "Kuwait", style: "Mujawwad", listeners: "2.5M+", bio: "One of the most famous Quran reciters in the Muslim world, known for his emotional and melodious recitation." },
  { id: "abdurrahmaan_as-sudays", name: "Abdul Rahman Al-Sudais", country: "Saudi Arabia", style: "Murattal", listeners: "1.8M+", bio: "Imam of the Grand Mosque in Mecca and one of the most influential reciters of the modern era." },
  { id: "sa3d_al-ghaamidi", name: "Saad Al Ghamidi", country: "Saudi Arabia", style: "Murattal", listeners: "1.5M+", bio: "Known for his clear and beautiful recitation, former imam of Masjid Al-Haram." },
  { id: "mishari_alafasy", name: "Mishari Alafasy", country: "Kuwait", style: "Mujawwad", listeners: "2.5M+", bio: "Kuwaiti qari and nasheed artist with a global following." },
  { id: "ahmad_al_ajmi", name: "Ahmad Al-Ajmi", country: "Kuwait", style: "Murattal", listeners: "1.2M+", bio: "Known for his serene and reflective recitation style." },
  { id: "yasser_ad-dussary", name: "Yasser Al-Dussary", country: "Saudi Arabia", style: "Murattal", listeners: "1.1M+", bio: "Imam and preacher at the Grand Mosque, known for his powerful recitation." },
  { id: "maher_al-muaiqly", name: "Maher Al-Muaiqly", country: "Saudi Arabia", style: "Murattal", listeners: "1.3M+", bio: "Imam of the Grand Mosque in Mecca with a distinctive melodic style." },
  { id: "abdul_basit_abdus_samad", name: "Abdul Basit Abdus Samad", country: "Egypt", style: "Mujawwad", listeners: "2.0M+", bio: "Legendary Egyptian qari, widely regarded as one of the greatest reciters of all time." },
  { id: "mohammad_al_luhaidan", name: "Mohammad Al-Luhaidan", country: "Saudi Arabia", style: "Murattal", listeners: "900K+", bio: "Known for his deeply emotional and moving recitation style." },
  { id: "nasser_al-qatami", name: "Nasser Al-Qatami", country: "Saudi Arabia", style: "Murattal", listeners: "850K+", bio: "Imam at Masjid Al-Haram with a beautiful and calm recitation." },
  { id: "ali_al-hudhaifi", name: "Ali Al-Hudhaifi", country: "Saudi Arabia", style: "Murattal", listeners: "750K+", bio: "Former imam of the Prophet's Mosque in Madinah." },
  { id: "salah_al-budair", name: "Salah Al-Budair", country: "Saudi Arabia", style: "Murattal", listeners: "800K+", bio: "Imam of the Prophet's Mosque known for his eloquent recitation." },
  { id: "khalid_al-jalil", name: "Khalid Al-Jalil", country: "Saudi Arabia", style: "Murattal", listeners: "600K+", bio: "Imam at the Grand Mosque with a distinctive recitation." },
  { id: "bandar_baleela", name: "Bandar Baleela", country: "Saudi Arabia", style: "Murattal", listeners: "700K+", bio: "Imam of the Grand Mosque in Mecca known for his beautiful voice." },
  { id: "hani_ar_rifai", name: "Hani Ar-Rifai", country: "Kuwait", style: "Mujawwad", listeners: "650K+", bio: "Kuwaiti qari with a unique and captivating recitation style." },
  { id: "muhammad_jibreel", name: "Muhammad Jibreel", country: "Egypt", style: "Mujawwad", listeners: "950K+", bio: "Egyptian qari known for his powerful and emotional recitation." },
  { id: "muhammad_ayyoub", name: "Muhammad Ayyoub", country: "Saudi Arabia", style: "Murattal", listeners: "550K+", bio: "Former imam of the Prophet's Mosque with a warm recitation style." },
  { id: "abdullah_basfar", name: "Abdullah Basfar", country: "Saudi Arabia", style: "Murattal", listeners: "500K+", bio: "Known for his clear and measured recitation of the Quran." },
  { id: "muhammad_al_tablawy", name: "Muhammad Al-Tablawy", country: "Egypt", style: "Mujawwad", listeners: "450K+", bio: "Egyptian qari known for his soulful and melodious recitation." },
  { id: "ahmed_ibn_ali_al_ajamy", name: "Ahmed Ibn Ali Al-Ajamy", country: "Saudi Arabia", style: "Murattal", listeners: "400K+", bio: "Imam and qari known for his precise and beautiful recitation." },
]

export default function RecitersPage() {
  const [search, setSearch] = useState("")

  const filtered = RECITERS.filter((r) => {
    if (!search.trim()) return true
    const q = search.toLowerCase().trim()
    return (
      r.name.toLowerCase().includes(q) ||
      r.country.toLowerCase().includes(q) ||
      r.style.toLowerCase().includes(q) ||
      r.bio.toLowerCase().includes(q)
    )
  })

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-islamic-green/20 to-islamic-gold/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-islamic-green" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Reciters
            </h1>
            <p className="text-sm text-muted-foreground">
              {RECITERS.length} renowned Quran reciters from around the world
            </p>
          </div>
        </div>

        <div className="relative mt-4 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reciters by name, country, or style..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl border-border/60 bg-card/60 focus-visible:border-islamic-green/50"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {filtered.map((reciter, idx) => (
          <motion.div
            key={reciter.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.02 }}
            className="group"
          >
            <div className={cn(
              "rounded-xl border border-border/50 bg-card p-4",
              "card-hover-glow transition-all h-full flex flex-col"
            )}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-islamic-green to-islamic-gold flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                  {reciter.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate group-hover:text-islamic-green transition-colors">
                    {reciter.name}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {reciter.country}
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground/70 leading-relaxed mb-3 line-clamp-2">
                {reciter.bio}
              </p>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/30">
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1 text-islamic-gold">
                    <Headphones className="h-3 w-3" />
                    {reciter.listeners}
                  </span>
                  <span className="text-muted-foreground">
                    {reciter.style}
                  </span>
                </div>
                <Button
                  size="icon"
                  className="h-8 w-8 rounded-full bg-islamic-green/10 text-islamic-green hover:bg-islamic-green hover:text-white transition-all shrink-0"
                >
                  <Play className="h-3.5 w-3.5 ml-0.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold mb-1">No reciters found</h3>
          <p className="text-sm text-muted-foreground">
            No reciters match your search. Try a different name.
          </p>
        </div>
      )}
    </div>
  )
}
