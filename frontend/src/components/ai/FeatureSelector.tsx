"use client"

import { motion } from "framer-motion"
import {
  MessageSquare,
  Search,
  BookOpen,
  Sun,
  Brain,
  BookMarked,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getFeatureLabel } from "@/store/aiStore"
import type { AIFeature } from "@/types"

interface FeatureSelectorProps {
  activeFeature: AIFeature
  onSelect: (feature: AIFeature) => void
}

const FEATURES: { id: AIFeature; icon: typeof MessageSquare; color: string }[] = [
  { id: "ask", icon: MessageSquare, color: "text-blue-500" },
  { id: "topics", icon: Search, color: "text-emerald-500" },
  { id: "explain", icon: BookOpen, color: "text-purple-500" },
  { id: "reflection", icon: Sun, color: "text-amber-500" },
  { id: "quiz", icon: Brain, color: "text-rose-500" },
  { id: "memorize", icon: BookMarked, color: "text-indigo-500" },
]

export function FeatureSelector({ activeFeature, onSelect }: FeatureSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pt-4 pb-2">
      {FEATURES.map((feature) => {
        const Icon = feature.icon
        const isActive = activeFeature === feature.id
        return (
          <motion.button
            key={feature.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(feature.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            <Icon className={cn("h-4 w-4", !isActive && feature.color)} />
            {getFeatureLabel(feature.id)}
          </motion.button>
        )
      })}
    </div>
  )
}
