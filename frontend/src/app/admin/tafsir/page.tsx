"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Trash2, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import api from "@/lib/api"
import type { Tafsir, Pagination } from "@/types"

export default function AdminTafsirPage() {
  const [entries, setEntries] = useState<Tafsir[]>([])
  const [sources, setSources] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState("")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const { toast } = useToast()

  const fetchTafsir = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = { page, limit: 50 }
      if (source) params.source = source
      const { data } = await api.get("/admin/tafsir", { params })
      setEntries(data.data)
      setPagination(data.pagination)
      if (data.sources) setSources(data.sources)
    } catch { toast({ title: "Failed to load tafsir", variant: "destructive" }) }
    finally { setLoading(false) }
  }, [page, source, toast])

  useEffect(() => { fetchTafsir() }, [fetchTafsir])
  useEffect(() => { setPage(1) }, [source])

  const deleteEntry = async (id: string) => {
    if (!confirm("Delete this tafsir entry?")) return
    try {
      await api.delete(`/admin/tafsir/${id}`)
      setEntries((prev) => prev.filter((e) => e._id !== id))
      toast({ title: "Tafsir entry deleted" })
    } catch { toast({ title: "Failed to delete", variant: "destructive" }) }
  }

  return (
    <div className="p-4 md:p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Manage Tafsir</h1>
        <p className="text-muted-foreground">View and manage tafsir commentaries</p>
      </motion.div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">{pagination ? `${pagination.totalItems} entries` : "Tafsir"}</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={source || "all"} onValueChange={(v) => setSource(v === "all" ? "" : v)}>
                <SelectTrigger className="w-40"><SelectValue placeholder="All sources" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  {sources.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
          ) : entries.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No tafsir entries found</div>
          ) : (
            <div className="divide-y">
              {entries.map((e) => (
                <div key={e._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">Surah {e.surahNumber} · Ayah {e.ayahNumber}<span className="ml-2 text-xs text-muted-foreground">{e.source}</span><span className="ml-1 text-xs text-muted-foreground">({e.language})</span></p>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{e.text}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="ml-2 h-8 w-8 shrink-0" onClick={() => deleteEntry(e._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
