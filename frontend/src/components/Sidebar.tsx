"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  BookOpen,
  BookMarked,
  Heart,
  Download,
  History,
  Settings,
  User,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Moon,
  Sun,
  Star,
  ChevronLeft,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"
import { cn } from "@/lib/utils"

const mainNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/surahs", label: "All Surahs", icon: BookOpen },
  { href: "/juz", label: "Juz", icon: BookMarked },
  { href: "/reciters", label: "Reciters", icon: Star },
]

const libraryNav = [
  { href: "/favorites", label: "Favorites", icon: Heart, auth: true },
  { href: "/bookmarks", label: "Bookmarks", icon: BookMarked, auth: true },
  { href: "/history", label: "History", icon: History, auth: true },
  { href: "/downloads", label: "Downloads", icon: Download, auth: true },
]

const bottomNav = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: User, auth: true },
]

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => setMounted(true), [])

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full flex flex-col",
          "bg-sidebar border-r border-border transition-all duration-300 ease-out",
          isOpen ? "w-64" : "w-0 md:w-16",
          "overflow-hidden"
        )}
      >
        <div className={cn("flex flex-col h-full", isOpen ? "px-3" : "px-0 md:px-2")}>
          {/* Logo */}
          <div className={cn(
            "flex items-center h-16 border-b border-border shrink-0 transition-all",
            isOpen ? "justify-between px-2" : "justify-center px-0"
          )}>
            {isOpen ? (
              <>
                <Link href="/" className="flex items-center gap-2.5 group">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-islamic-green to-islamic-green-dark shadow-md group-hover:shadow-lg transition-shadow shrink-0">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6V6z"/>
                    </svg>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-lg font-bold text-islamic-green-dark dark:text-islamic-green -mb-0.5">Quran</span>
                    <span className="text-[10px] font-medium text-islamic-gold tracking-wider uppercase">Audio</span>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                  onClick={onToggle}
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
                onClick={onToggle}
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 sidebar-scroll overflow-y-auto min-h-0">
            {isOpen ? (
              <>
                {/* Main */}
                <div className="mb-1 px-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">Main</p>
                  <div className="space-y-0.5">
                    {mainNav.map((item) => {
                      const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "sidebar-link",
                            isActive ? "sidebar-link-active" : "sidebar-link-inactive"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{item.label}</span>
                          {isActive && (
                            <motion.div
                              layoutId="sidebar-active"
                              className="ml-auto h-1.5 w-1.5 rounded-full bg-islamic-green"
                            />
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Library */}
                {isAuthenticated && (
                  <div className="mb-1 px-2 mt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">Library</p>
                    <div className="space-y-0.5">
                      {libraryNav.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href)
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "sidebar-link",
                              isActive ? "sidebar-link-active" : "sidebar-link-inactive"
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span>{item.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Bottom */}
                <div className="px-2 mt-4">
                  <div className="space-y-0.5">
                    {bottomNav.map((item) => {
                      if (item.auth && !isAuthenticated) return null
                      const isActive = pathname === item.href
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "sidebar-link",
                            isActive ? "sidebar-link-active" : "sidebar-link-inactive"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </>
            ) : (
              /* Collapsed icons */
              <div className="flex flex-col items-center gap-3 mt-2">
                {mainNav.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-center h-9 w-9 rounded-xl transition-all",
                        isActive
                          ? "bg-islamic-green/10 text-islamic-green"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                      )}
                      title={item.label}
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  )
                })}
                {isAuthenticated && libraryNav.slice(0, 2).map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-center h-9 w-9 rounded-xl text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-all"
                      title={item.label}
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  )
                })}
                <Link
                  href="/settings"
                  className="flex items-center justify-center h-9 w-9 rounded-xl text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-all"
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </Link>
              </div>
            )}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-border shrink-0">
            {/* Theme toggle */}
            <div className={cn("flex items-center py-3", isOpen ? "justify-between px-3" : "justify-center")}>
              {isOpen && (
                <span className="text-xs text-muted-foreground">Theme</span>
              )}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-islamic-gold hover:text-islamic-gold-dark hover:bg-islamic-gold/10"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              )}
            </div>

            {/* User section */}
            {isAuthenticated ? (
              <div className={cn("py-2", isOpen ? "px-3" : "flex justify-center")}>
                {isOpen ? (
                  <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent p-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-islamic-green to-islamic-green-dark flex items-center justify-center text-white text-sm font-semibold shrink-0">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{user?.email || ""}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={logout}
                    >
                      <LogOut className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-islamic-green to-islamic-green-dark flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
            ) : (
              isOpen && (
                <div className="px-3 py-2 space-y-2">
                  <Link href="/login" className="block">
                    <Button variant="outline" size="sm" className="w-full h-9 text-xs">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup" className="block">
                    <Button size="sm" className="w-full h-9 text-xs bg-gradient-to-r from-islamic-green to-islamic-green-dark text-white">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
