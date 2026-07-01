"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, BookOpen, Bot, LayoutDashboard, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"

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

  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password"

  if (isAuthPage) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/80 backdrop-blur-lg md:hidden safe-area-bottom"
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
                "flex flex-col items-center gap-0.5 py-2 px-3 min-w-0 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-none">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
