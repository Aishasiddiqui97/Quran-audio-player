import { create } from "zustand"
import { persist } from "zustand/middleware"
import api from "@/lib/api"
import type { AIFeature, AIMessage, Conversation, ConversationListItem, AIResponse, QuizQuestion } from "@/types"

interface AIState {
  conversations: ConversationListItem[]
  activeConversation: Conversation | null
  messages: AIMessage[]
  isProcessing: boolean
  activeFeature: AIFeature
  quizState: QuizQuestion | null
  quizAnswered: boolean
  quizSelectedIndex: number | null

  setActiveFeature: (feature: AIFeature) => void
  sendMessage: (content: string) => Promise<void>
  loadConversations: () => Promise<void>
  loadConversation: (id: string) => Promise<void>
  deleteConversation: (id: string) => Promise<void>
  startNewConversation: () => void
  getDailyReflection: () => Promise<void>
  generateQuiz: () => Promise<void>
  answerQuiz: (index: number) => void
  resetQuiz: () => void
}

const FEATURE_PROMPTS: Record<AIFeature, string> = {
  ask: "Ask any question about the Quran...",
  topics: "Search Quranic verses by topic...",
  explain: "Enter surah and verse number (e.g., 1:1-7)...",
  reflection: "",
  quiz: "",
  memorize: "Enter surah and verse range (e.g., 1:1-7)...",
}

const FEATURE_LABELS: Record<AIFeature, string> = {
  ask: "Ask Questions",
  topics: "Topic Finder",
  explain: "Verse Explanation",
  reflection: "Daily Reflection",
  quiz: "Quiz Generator",
  memorize: "Memorization Helper",
}

function getPlaceholder(feature: AIFeature): string {
  return FEATURE_PROMPTS[feature]
}

function getFeatureLabel(feature: AIFeature): string {
  return FEATURE_LABELS[feature]
}

async function callAI(
  endpoint: string,
  body: Record<string, unknown>
) {
  const res = await api.post<{ data: AIResponse }>(endpoint, body)
  return res.data
}

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversation: null,
      messages: [],
      isProcessing: false,
      activeFeature: "ask",
      quizState: null,
      quizAnswered: false,
      quizSelectedIndex: null,

      setActiveFeature: (feature) => {
        set({ activeFeature: feature })
      },

      sendMessage: async (content) => {
        const { activeFeature, activeConversation } = get()

        const userMessage: AIMessage = {
          role: "user",
          content,
          timestamp: Date.now(),
        }
        set((state) => ({ messages: [...state.messages, userMessage], isProcessing: true }))

        try {
          let endpoint = ""
          let body: Record<string, unknown> = { conversationId: activeConversation?._id }

          switch (activeFeature) {
            case "ask":
              endpoint = "/ai/ask"
              body.question = content
              break
            case "topics":
              endpoint = "/ai/topics"
              body.topic = content
              break
            case "explain": {
              endpoint = "/ai/explain"
              const match = content.match(/(\d+)\s*[:，]\s*(\d+)/)
              if (match) {
                body.surahNumber = parseInt(match[1], 10)
                body.ayahNumber = parseInt(match[2], 10)
              } else {
                body.surahNumber = parseInt(content.split(/[:，\s]+/)[0], 10)
                body.ayahNumber = parseInt(content.split(/[:，\s]+/)[1], 10)
              }
              break
            }
            case "memorize": {
              endpoint = "/ai/memorize"
              const parts = content.match(/(\d+)\s*[:，]\s*(\d+)\s*[-–]\s*(\d+)/)
              if (parts) {
                body.surahNumber = parseInt(parts[1], 10)
                body.startAyah = parseInt(parts[2], 10)
                body.endAyah = parseInt(parts[3], 10)
              } else {
                body.surahNumber = parseInt(content.split(/[:，\s]+/)[0], 10)
                body.startAyah = parseInt(content.split(/[:，\s]+/)[1], 10)
                body.endAyah = parseInt(content.split(/[:，\s]+/)[2], 10)
              }
              break
            }
          }

          const response = endpoint
            ? await callAI(endpoint, body)
            : { data: { content: "Feature not available" } as AIResponse }

          const assistantMessage: AIMessage = {
            role: "assistant",
            content: response.data.content,
            timestamp: Date.now(),
            metadata: response.data.metadata,
          }

          set((state) => ({
            messages: [...state.messages, assistantMessage],
            isProcessing: false,
            activeConversation: response.data.conversationId
              ? { ...state.activeConversation, _id: response.data.conversationId! } as Conversation
              : state.activeConversation,
          }))

          get().loadConversations()
        } catch {
          const errorMessage: AIMessage = {
            role: "assistant",
            content: "Sorry, I encountered an error processing your request. Please try again.",
            timestamp: Date.now(),
          }
          set((state) => ({
            messages: [...state.messages, errorMessage],
            isProcessing: false,
          }))
        }
      },

      loadConversations: async () => {
        try {
          const res = await api.get<{ data: ConversationListItem[] }>("/ai/conversations")
          set({ conversations: res.data.data || [] })
        } catch {
          /* silently fail */
        }
      },

      loadConversation: async (id) => {
        try {
          const res = await api.get<{ data: Conversation }>(`/ai/conversations/${id}`)
          const conv = res.data.data
          set({
            activeConversation: conv,
            messages: conv.messages,
            activeFeature: conv.feature,
          })
        } catch {
          /* silently fail */
        }
      },

      deleteConversation: async (id) => {
        try {
          await api.delete(`/ai/conversations/${id}`)
          set((state) => ({
            conversations: state.conversations.filter((c) => c._id !== id),
            activeConversation:
              state.activeConversation?._id === id ? null : state.activeConversation,
            messages:
              state.activeConversation?._id === id ? [] : state.messages,
          }))
        } catch {
          /* silently fail */
        }
      },

      startNewConversation: () => {
        set({
          activeConversation: null,
          messages: [],
          quizState: null,
          quizAnswered: false,
          quizSelectedIndex: null,
        })
      },

      getDailyReflection: async () => {
        set({ isProcessing: true })
        try {
          const res = await api.get<{ data: AIResponse }>("/ai/reflection")
          const assistantMessage: AIMessage = {
            role: "assistant",
            content: res.data.data.content,
            timestamp: Date.now(),
            metadata: res.data.data.metadata,
          }
          set((state) => ({
            messages: [...state.messages, assistantMessage],
            isProcessing: false,
          }))
        } catch {
          set({ isProcessing: false })
        }
      },

      generateQuiz: async () => {
        set({ isProcessing: true, quizState: null, quizAnswered: false, quizSelectedIndex: null })
        try {
          const res = await api.post<{ data: AIResponse }>("/ai/quiz")
          const quizData = res.data.data
          let quiz: QuizQuestion | null = null

          if (quizData.metadata?.type === "quiz") {
            quiz = quizData.metadata.question as QuizQuestion
          } else {
            try {
              quiz = JSON.parse(quizData.content)
            } catch {
              /* not JSON */
            }
          }

          if (quiz) {
            set({ quizState: quiz, isProcessing: false })
          } else {
            const assistantMessage: AIMessage = {
              role: "assistant",
              content: quizData.content,
              timestamp: Date.now(),
            }
            set((state) => ({
              messages: [...state.messages, assistantMessage],
              isProcessing: false,
            }))
          }
        } catch {
          set({ isProcessing: false })
        }
      },

      answerQuiz: (index) => {
        const { quizState } = get()
        if (!quizState) return
        set({ quizAnswered: true, quizSelectedIndex: index })
      },

      resetQuiz: () => {
        set({ quizState: null, quizAnswered: false, quizSelectedIndex: null })
      },
    }),
    {
      name: "quran-ai-store",
      partialize: (state) => ({
        activeFeature: state.activeFeature,
      }),
    }
  )
)

export { getPlaceholder, getFeatureLabel }
