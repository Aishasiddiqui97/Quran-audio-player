"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Search, Trash2, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import api from "@/lib/api"
import { cn } from "@/lib/utils"
import type { Pagination } from "@/types"

interface SurahData {
  _id: string; surahNumber: number; nameArabic: string; nameSimple: string; nameEnglish: string; revelationType: string; totalAyahs: number
}

export default function AdminSurahsPage() {
  const [surahs, setSurahs] = useState<SurahData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const { toast } = useToast()

  const fetchSurahs = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get("/admin/surahs", { params: { page, limit: 50, search } })
      setSurahs(data.data)
      setPagination(data.pagination)
    } catch {
      toast({ title: "Failed to load surahs", variant: "destructive" })
    } finally { setLoading(false) }
  }, [page, search, toast])

  useEffect(() => { fetchSurahs() }, [fetchSurahs])
  useEffect(() => { setPage(1) }, [search])

  const deleteSurah = async (surahNumber: number, name: string) => {
    if (!confirm(`Delete Surah ${name} (#${surahNumber})? This will also delete all related ayahs, translations, tafsir, and audio entries.`)) return
    try {
      await api.delete(`/admin/surahs/${surahNumber}`)
      setSurahs((prev) => prev.filter((s) => s.surahNumber !== surahNumber))
      toast({ title: `Surah ${name} deleted` })
    } catch { toast({ title: "Failed to delete surah", variant: "destructive" }) }
  }

  return (
    <div className="p-4 md:p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Manage Surahs</h1>
        <p className="text-muted-foreground">View and manage Quran surahs</p>
      </motion.div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">{pagination ? `${pagination.totalItems} surahs` : "Surahs"}</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search surahs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
          ) : surahs.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No surahs found</div>
          ) : (
            <div className="divide-y">
              {surahs.map((s) => (
                <div key={s._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/5 text-xs font-bold text-muted-foreground">{s.surahNumber}</div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{s.nameSimple}<span className="ml-2 text-xs text-muted-foreground" dir="rtl">{s.nameArabic}</span></p>
                      <p className="truncate text-xs text-muted-foreground">{s.nameEnglish} · {s.totalAyahs} ayahs · <span className={cn(s.revelationType === "Meccan" ? "text-emerald-500" : "text-blue-500")}>{s.revelationType}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/surahs/${s.surahNumber}`} target="_blank"><Button variant="ghost" size="icon" className="h-8 w-8"><ExternalLink className="h-4 w-4" /></Button></Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteSurah(s.surahNumber, s.nameSimple)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <p className="text-sm text-muted-foreground">Page {pagination.currentPage} of {pagination.totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={!pagination.hasPrevPage} onClick={() => setPage((p) => Math.max(1, p - 1))}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" disabled={!pagination.hasNextPage} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
