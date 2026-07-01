import type { Metadata } from "next"
import { AuthGuard } from "@/components/AuthGuard"

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your personal Quran reading dashboard - track progress, manage bookmarks, notes, and favorites.",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}
