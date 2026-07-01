"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getPlaceholder } from "@/store/aiStore"
import type { AIFeature } from "@/types"

interface ChatInputProps {
  feature: AIFeature
  isProcessing: boolean
  onSend: (message: string) => void
}

export function ChatInput({ feature, isProcessing, onSend }: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  function handleSubmit() {
    const trimmed = input.trim()
    if (!trimmed || isProcessing) return
    onSend(trimmed)
    setInput("")
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (feature === "reflection" || feature === "quiz") {
    return null
  }

  return (
    <div className="border-t bg-background/80 backdrop-blur-sm p-4">
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder(feature)}
            className="min-h-[44px] max-h-[200px] resize-none rounded-xl pr-12"
            rows={1}
            disabled={isProcessing}
          />
          <Button
            size="icon"
            className="absolute right-1.5 bottom-1.5 h-8 w-8"
            onClick={handleSubmit}
            disabled={!input.trim() || isProcessing}
            aria-label="Send message"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
