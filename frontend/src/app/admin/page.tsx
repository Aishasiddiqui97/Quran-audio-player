"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Users,
  BookOpen,
  FileText,
  Languages,
  Music,
  BookMarked,
  TrendingUp,
  Activity,
  UserPlus,
  Clock,
  Shield,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import api from "@/lib/api"

interface Analytics {
  users: { total: number; admins: number }
  surahs: number
  ayahs: number
  translations: number
  tafsir: number
  audio: number
  wordByWord: number
  recentUsers: { _id: string; name: string; email: string; role: string; createdAt: string }[]
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get("/admin/analytics")
      .then((res) => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { title: "Users", value: data?.users.total, sub: `${data?.users.admins || 0} admins`, icon: Users, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { title: "Surahs", value: data?.surahs, sub: "114 total", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
    { title: "Ayahs", value: data?.ayahs, sub: "verses", icon: BookMarked, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
    { title: "Translations", value: data?.translations, sub: "editions", icon: Languages, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
    { title: "Tafsir", value: data?.tafsir, sub: "commentaries", icon: FileText, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-900/30" },
    { title: "Audio", value: data?.audio, sub: "recordings", icon: Music, color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-900/30" },
  ]

  return (
    <div className="p-4 md:p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your Quran platform</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card, idx) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <div className={`rounded-lg ${card.bg} p-2 ${card.color}`}>
                  <card.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{card.value?.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">{card.sub}</p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-primary" />
                Platform Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-4 w-full" />)}</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="flex items-center gap-2 text-sm"><Activity className="h-4 w-4 text-muted-foreground" /> Total Data Entries</span>
                    <span className="font-semibold">{((data?.ayahs || 0) + (data?.translations || 0) + (data?.tafsir || 0) + (data?.audio || 0) + (data?.wordByWord || 0)).toLocaleString()}</span>
                  </div>
                  {[
                    { label: "Ayahs", value: data?.ayahs },
                    { label: "Translations", value: data?.translations },
                    { label: "Tafsir", value: data?.tafsir },
                    { label: "Word by Word", value: data?.wordByWord },
                    { label: "Audio", value: data?.audio },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span>{(row.value || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserPlus className="h-4 w-4 text-primary" />
                Recent Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : (
                <div className="space-y-3">
                  {data?.recentUsers?.map((u) => (
                    <div key={u._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {u.role === "admin" && <Shield className="h-3 w-3 text-amber-500" />}
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
