"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Trash2, ChevronLeft, ChevronRight, Filter, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import api from "@/lib/api"
import type { Audio, Pagination } from "@/types"

export default function AdminAudioPage() {
  const [entries, setEntries] = useState<Audio[]>([])
  const [reciters, setReciters] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [reciter, setReciter] = useState("")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const { toast } = useToast()

  const fetchAudio = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = { page, limit: 50 }
      if (reciter) params.reciter = reciter
      const { data } = await api.get("/admin/audio", { params })
      setEntries(data.data)
      setPagination(data.pagination)
      if (data.reciters) setReciters(data.reciters)
    } catch { toast({ title: "Failed to load audio entries", variant: "destructive" }) }
    finally { setLoading(false) }
  }, [page, reciter, toast])

  useEffect(() => { fetchAudio() }, [fetchAudio])
  useEffect(() => { setPage(1) }, [reciter])

  const deleteEntry = async (id: string) => {
    if (!confirm("Delete this audio entry?")) return
    try {
      await api.delete(`/admin/audio/${id}`)
      setEntries((prev) => prev.filter((e) => e._id !== id))
      toast({ title: "Audio entry deleted" })
    } catch { toast({ title: "Failed to delete", variant: "destructive" }) }
  }

  return (
    <div className="p-4 md:p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Manage Audio</h1>
        <p className="text-muted-foreground">View and manage audio recordings</p>
      </motion.div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">{pagination ? `${pagination.totalItems} entries` : "Audio"}</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={reciter || "all"} onValueChange={(v) => setReciter(v === "all" ? "" : v)}>
                <SelectTrigger className="w-40"><SelectValue placeholder="All reciters" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All reciters</SelectItem>
                  {reciters.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
          ) : entries.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No audio entries found</div>
          ) : (
            <div className="divide-y">
              {entries.map((e) => (
                <div key={e._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">Surah {e.surahNumber} · Ayah {e.ayahNumber}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground"><Headphones className="h-3 w-3" />{e.reciter} <span className="ml-1">({e.reciterId})</span></p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a href={e.audioUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary truncate max-w-[200px] hidden sm:block">{e.audioUrl.split("/").pop()}</a>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteEntry(e._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
