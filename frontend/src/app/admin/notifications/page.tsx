"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Send, Loader2, Info, AlertTriangle, CheckCircle, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import api from "@/lib/api"
import type { Pagination } from "@/types"

interface Notification {
  _id: string; title: string; message: string; type: string; sentAt: string; createdAt: string
}

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [type, setType] = useState("info")
  const [sending, setSending] = useState(false)
  const [history, setHistory] = useState<Notification[]>([])
  const { toast } = useToast()

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) return
    setSending(true)
    try {
      const { data } = await api.post("/admin/notifications", { title, message, type })
      setHistory((prev) => [data.notification, ...prev])
      setTitle(""); setMessage(""); setType("info")
      toast({ title: "Notification sent", variant: "success" })
    } catch { toast({ title: "Failed to send notification", variant: "destructive" }) }
    finally { setSending(false) }
  }

  const typeIcon: Record<string, React.ComponentType<{ className?: string }>> = { info: Info, warning: AlertTriangle, success: CheckCircle, announcement: Megaphone }
  const colorMap: Record<string, string> = {
    info: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    warning: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
    success: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30",
    announcement: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
  }

  return (
    <div className="p-4 md:p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Send notifications to platform users</p>
      </motion.div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Send className="h-4 w-4 text-primary" /> Send Notification</CardTitle>
            <CardDescription>Compose and send a notification to all users</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Notification title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Notification message..." value={message} onChange={(e) => setMessage(e.target.value)} rows={4} required />
              </div>
              <Button type="submit" disabled={sending || !title.trim() || !message.trim()} className="gap-2">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send Notification
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Bell className="h-4 w-4 text-primary" /> Recent Notifications</CardTitle>
            <CardDescription>Notifications sent during this session</CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted"><Bell className="h-6 w-6 text-muted-foreground" /></div>
                <p className="text-sm text-muted-foreground">No notifications sent yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((n, idx) => {
                  const Icon = typeIcon[n.type] || Info
                  const colors = colorMap[n.type] || colorMap.info
                  return (
                    <div key={idx} className="rounded-lg border p-4">
                      <div className="flex items-start gap-3">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colors}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                          <p className="mt-1 text-xs text-muted-foreground">Sent {new Date(n.sentAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
