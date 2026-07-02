"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, BookOpen, Bot, LayoutDashboard, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"
import { useAudioPlayerStore } from "@/store/audioPlayerStore"

const links = [
  { href: "/", label: "Home", icon: Book, auth: false },
  { href: "/surahs", label: "Surahs", icon: BookOpen, auth: false },
  { href: "/ai", label: "AI", icon: Bot, auth: false },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, auth: true },
  { href: "/profile", label: "Profile", icon: User, auth: true },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuthStore()
  const { currentTrack } = useAudioPlayerStore()

  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password"

  if (isAuthPage) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 glass-strong md:hidden safe-area-bottom"
      style={{ bottom: currentTrack ? "64px" : "0" }}
      aria-label="Bottom navigation"
    >
      <div className="flex items-center justify-around px-2 pb-safe">
        {links.map((link) => {
          if (link.auth && !isAuthenticated) return null
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 py-2 px-3 min-w-0 transition-all",
                isActive
                  ? "text-islamic-green"
                  : "text-muted-foreground hover:text-islamic-green-dark"
              )}
            >
              <div className={cn(
                "rounded-full p-1.5 transition-all",
                isActive && "bg-islamic-green/10"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium leading-none">{link.label}</span>
              {isActive && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full bg-islamic-green" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
