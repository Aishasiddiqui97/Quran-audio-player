"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Sidebar } from "@/components/Sidebar"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { AudioPlayer } from "@/components/audio/AudioPlayer"
import { BottomNavigation } from "@/components/BottomNavigation"

const FloatingParticles = dynamic(
  () => import("@/components/FloatingParticles").then((m) => m.FloatingParticles),
  { ssr: false }
)

export default function QuranLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen relative islamic-pattern">
      <FloatingParticles count={15} />
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 flex flex-col transition-all duration-300 relative z-10 ${sidebarOpen ? "md:ml-64" : "md:ml-16"}`}>
        <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main id="main-content" className="flex-1 pb-20 md:pb-24">
          {children}
        </main>
        <Footer />
      </div>
      <AudioPlayer />
      <BottomNavigation />
    </div>
  )
}
