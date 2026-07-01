"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  MessageSquare,
  Trash2,
  Loader2,
  Search,
  BookOpen,
  Sun,
  Brain,
  BookMarked,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAIStore, getFeatureLabel } from "@/store/aiStore"
import type { AIFeature } from "@/types"

const FEATURE_ICONS: Record<AIFeature, typeof MessageSquare> = {
  ask: MessageSquare,
  topics: Search,
  explain: BookOpen,
  reflection: Sun,
  quiz: Brain,
  memorize: BookMarked,
}

export function ConversationSidebar() {
  const {
    conversations,
    activeConversation,
    loadConversations,
    loadConversation,
    deleteConversation,
    startNewConversation,
  } = useAIStore()

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-sm font-semibold">History</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={startNewConversation}
          aria-label="New conversation"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence initial={false}>
          {conversations.length === 0 ? (
            <p className="px-2 py-8 text-center text-xs text-muted-foreground">
              No conversations yet
            </p>
          ) : (
            conversations.map((conv) => {
              const Icon = FEATURE_ICONS[conv.feature] || MessageSquare
              const isActive = activeConversation?._id === conv._id
              return (
                <motion.div
                  key={conv._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={cn(
                    "group flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm cursor-pointer transition-all mb-1",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => loadConversation(conv._id)}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1 truncate text-xs">
                    {conv.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteConversation(conv._id)
                    }}
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
