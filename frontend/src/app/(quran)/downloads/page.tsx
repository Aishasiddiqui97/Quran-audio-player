"use client"

import { motion } from "framer-motion"
import { Download, ArrowDownToLine, Music, BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DownloadsPage() {
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center">
            <Download className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Downloads
            </h1>
            <p className="text-sm text-muted-foreground">
              Your downloaded surahs and audio for offline listening
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="relative mb-8">
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 flex items-center justify-center border border-purple-200/20">
            <ArrowDownToLine className="h-12 w-12 text-purple-400/60" />
          </div>
          <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-gradient-to-br from-islamic-green/20 to-islamic-gold/20 flex items-center justify-center">
            <Music className="h-5 w-5 text-islamic-green" />
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2">No downloads yet</h2>
        <p className="text-muted-foreground mb-2 max-w-sm">
          Download surahs and recitations for offline listening.
        </p>
        <p className="text-sm text-muted-foreground/60 mb-8 max-w-sm">
          Downloads will appear here once you save them for offline access.
        </p>
        <Link href="/surahs">
          <Button className="gap-2 bg-gradient-to-r from-islamic-green to-islamic-green-dark text-white shadow-lg hover:shadow-xl">
            <BookOpen className="h-4 w-4" />
            Browse Surahs
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
