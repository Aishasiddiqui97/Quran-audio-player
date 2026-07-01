"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Bot,
  MessageSquare,
  Sun,
  Brain,
  Loader2,
  ChevronLeft,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { ChatMessage } from "@/components/ai/ChatMessage"
import { ChatInput } from "@/components/ai/ChatInput"
import { FeatureSelector } from "@/components/ai/FeatureSelector"
import { ConversationSidebar } from "@/components/ai/ConversationSidebar"
import { QuizQuestion } from "@/components/ai/QuizQuestion"
import { useAIStore, getFeatureLabel } from "@/store/aiStore"
import { useAuthStore } from "@/store/authStore"
import type { AIFeature, QuizQuestion as QuizQuestionType } from "@/types"

const FEATURE_DESCRIPTIONS: Record<AIFeature, { title: string; description: string; icon: typeof Sparkles }> = {
  ask: {
    title: "Ask Questions",
    description: "Ask any question about the Quran and get detailed answers with references.",
    icon: MessageSquare,
  },
  topics: {
    title: "Topic Finder",
    description: "Search for Quranic verses related to any topic or theme.",
    icon: MessageSquare,
  },
  explain: {
    title: "Verse Explanation",
    description: "Get detailed explanations of specific verses with context and tafsir.",
    icon: MessageSquare,
  },
  reflection: {
    title: "Daily Reflection",
    description: "Receive a thoughtful verse and reflection to inspire your day.",
    icon: Sun,
  },
  quiz: {
    title: "Quiz Generator",
    description: "Test your Quran knowledge with interactive multiple-choice questions.",
    icon: Brain,
  },
  memorize: {
    title: "Memorization Helper",
    description: "Get structured help to memorize verses with tips and chunking.",
    icon: MessageSquare,
  },
}

export default function AIPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated } = useAuthStore()
  const {
    messages,
    isProcessing,
    activeFeature,
    quizState,
    quizAnswered,
    quizSelectedIndex,
    setActiveFeature,
    sendMessage,
    getDailyReflection,
    generateQuiz,
    answerQuiz,
    resetQuiz,
  } = useAIStore()

  const featureInfo = FEATURE_DESCRIPTIONS[activeFeature]
  const Icon = featureInfo.icon

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, quizState])

  const showWelcome = messages.length === 0 && !quizState

  function handleSend(content: string) {
    if (activeFeature === "reflection") {
      getDailyReflection()
      return
    }
    if (activeFeature === "quiz") {
      generateQuiz()
      return
    }
    sendMessage(content)
  }

  function handleFeatureSelect(feature: AIFeature) {
    setActiveFeature(feature)
    if (feature === "reflection") {
      getDailyReflection()
    }
    if (feature === "quiz") {
      generateQuiz()
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-72 border-r bg-card transition-transform duration-300 md:relative md:top-0 md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:hidden"
        )}
      >
        <ConversationSidebar />
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex items-center gap-3 border-b bg-background/80 backdrop-blur-sm px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bot className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h1 className="text-sm font-semibold">AI Quran Assistant</h1>
            <p className="text-xs text-muted-foreground">
              Powered by intelligent Quran insights
            </p>
          </div>
        </header>

        <FeatureSelector
          activeFeature={activeFeature}
          onSelect={handleFeatureSelect}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4" role="log" aria-live="polite" aria-label="Chat messages">
            {showWelcome ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent"
                >
                  <Bot className="h-10 w-10 text-primary" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold mb-2"
                >
                  {featureInfo.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="max-w-md text-muted-foreground mb-8"
                >
                  {featureInfo.description}
                </motion.p>

                {activeFeature === "reflection" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={() => getDailyReflection()}
                      size="lg"
                      className="gap-2"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Sun className="h-5 w-5" />
                      )}
                      Get Today&apos;s Reflection
                    </Button>
                  </motion.div>
                )}

                {activeFeature === "quiz" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={() => generateQuiz()}
                      size="lg"
                      className="gap-2"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Brain className="h-5 w-5" />
                      )}
                      Generate Quiz Question
                    </Button>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <AnimatePresence initial={false}>
                  {messages.map((msg, idx) => (
                    <ChatMessage key={`msg-${idx}-${msg.timestamp}`} message={msg} />
                  ))}
                </AnimatePresence>

                {quizState && (
                  <QuizQuestion
                    quiz={quizState}
                    answered={quizAnswered}
                    selectedIndex={quizSelectedIndex}
                    onAnswer={answerQuiz}
                    onNext={generateQuiz}
                  />
                )}

                {isProcessing && (
                  <div className="flex items-center gap-3 py-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    </div>
                    <div className="flex gap-1">
                      <Skeleton className="h-3 w-2 rounded-full" />
                      <Skeleton className="h-3 w-2 rounded-full" />
                      <Skeleton className="h-3 w-2 rounded-full" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Thinking...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        <ChatInput
          feature={activeFeature}
          isProcessing={isProcessing}
          onSend={handleSend}
        />
      </div>
    </div>
  )
}
