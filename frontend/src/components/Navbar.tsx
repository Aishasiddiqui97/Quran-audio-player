"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { PanelLeft, Search, Bell, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"
import { cn } from "@/lib/utils"

interface NavbarProps {
  sidebarOpen?: boolean
  onToggleSidebar?: () => void
}

export function Navbar({ sidebarOpen, onToggleSidebar }: NavbarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated } = useAuthStore()

  useEffect(() => setMounted(true), [])

  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password"
  if (isAuthPage) return null

  return (
    <header className="sticky top-0 z-30 w-full glass border-b border-border/50">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground hidden md:flex"
              onClick={onToggleSidebar}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            {pathname.startsWith("/surahs") && (
              <>
                <span className="text-muted-foreground/40">/</span>
                <span className="font-medium text-foreground">Surahs</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground relative"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-islamic-gold" />
            </Button>
          )}

          {/* Theme */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-islamic-gold hover:text-islamic-gold-dark hover:bg-islamic-gold/10"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

          {/* Auth buttons */}
          {!isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="h-8 text-xs">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="h-8 text-xs bg-gradient-to-r from-islamic-green to-islamic-green-dark text-white shadow-sm">
                  Sign up
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-islamic-green to-islamic-green-dark flex items-center justify-center text-white text-xs font-semibold">
                  U
                </div>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
