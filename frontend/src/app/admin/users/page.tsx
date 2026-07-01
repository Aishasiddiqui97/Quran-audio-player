"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Trash2, Shield, ShieldOff, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import api from "@/lib/api"
import { cn } from "@/lib/utils"
import type { Pagination } from "@/types"

interface UserData {
  _id: string; name: string; email: string; role: "user" | "admin"; isVerified: boolean; createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get("/admin/users", { params: { page, limit: 20, search } })
      setUsers(data.data)
      setPagination(data.pagination)
    } catch {
      toast({ title: "Failed to load users", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [page, search, toast])

  useEffect(() => { fetchUsers() }, [fetchUsers])
  useEffect(() => { setPage(1) }, [search])

  const toggleRole = async (userId: string, currentRole: string) => {
    setTogglingId(userId)
    const newRole = currentRole === "admin" ? "user" : "admin"
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole })
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role: newRole as "user" | "admin" } : u))
      toast({ title: `User role changed to ${newRole}` })
    } catch {
      toast({ title: "Failed to update role", variant: "destructive" })
    } finally {
      setTogglingId(null)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return
    try {
      await api.delete(`/admin/users/${userId}`)
      setUsers((prev) => prev.filter((u) => u._id !== userId))
      toast({ title: "User deleted" })
    } catch {
      toast({ title: "Failed to delete user", variant: "destructive" })
    }
  }

  return (
    <div className="p-4 md:p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>
        <p className="text-muted-foreground">View, promote, and manage users</p>
      </motion.div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">{pagination ? `${pagination.totalItems} users` : "Users"}</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No users found</div>
          ) : (
            <div className="divide-y">
              {users.map((u) => (
                <div key={u._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{u.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", u.role === "admin" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-muted text-muted-foreground")}>{u.role}</div>
                    {u.isVerified && <div className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">verified</div>}
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={togglingId === u._id} onClick={() => toggleRole(u._id, u.role)} title={u.role === "admin" ? "Demote to user" : "Promote to admin"}>
                      {togglingId === u._id ? <Loader2 className="h-4 w-4 animate-spin" /> : u.role === "admin" ? <ShieldOff className="h-4 w-4 text-amber-500" /> : <Shield className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteUser(u._id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
