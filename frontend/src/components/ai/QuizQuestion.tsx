"use client"

import { motion } from "framer-motion"
import { Check, X, RefreshCw, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { QuizQuestion } from "@/types"

interface QuizQuestionProps {
  quiz: QuizQuestion
  answered: boolean
  selectedIndex: number | null
  onAnswer: (index: number) => void
  onNext: () => void
}

export function QuizQuestion({
  quiz,
  answered,
  selectedIndex,
  onAnswer,
  onNext,
}: QuizQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl py-4"
    >
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Quiz Question</h3>
            <p className="text-xs text-muted-foreground">
              Test your Quran knowledge
            </p>
          </div>
        </div>

        <p className="mb-4 text-base font-medium">{quiz.question}</p>

        <div className="space-y-2">
          {quiz.options.map((option, idx) => {
            const isCorrect = idx === quiz.correctIndex
            const isSelected = idx === selectedIndex
            const showResult = answered

            return (
              <button
                key={idx}
                onClick={() => !answered && onAnswer(idx)}
                disabled={answered}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition-all",
                  !answered && "hover:border-primary/50 hover:bg-muted/50 cursor-pointer",
                  showResult && isCorrect && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20",
                  showResult && isSelected && !isCorrect && "border-destructive bg-destructive/5"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                    showResult && isCorrect && "bg-emerald-500 text-white",
                    showResult && isSelected && !isCorrect && "bg-destructive text-destructive-foreground",
                    !showResult && "bg-muted text-muted-foreground"
                  )}
                >
                  {showResult && isCorrect ? (
                    <Check className="h-4 w-4" />
                  ) : showResult && isSelected && !isCorrect ? (
                    <X className="h-4 w-4" />
                  ) : (
                    String.fromCharCode(65 + idx)
                  )}
                </span>
                <span>{option}</span>
              </button>
            )
          })}
        </div>

        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-3"
            role="alert"
            aria-live="assertive"
          >
            <div
              className={cn(
                "rounded-xl p-3 text-sm",
                selectedIndex === quiz.correctIndex
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300"
                  : "bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300"
              )}
            >
              <p className="font-medium mb-1">
                {selectedIndex === quiz.correctIndex
                  ? "Correct!"
                  : "Incorrect"}
              </p>
              <p className="text-muted-foreground">{quiz.explanation}</p>
            </div>

            <Button onClick={onNext} className="w-full gap-2">
              <RefreshCw className="h-4 w-4" />
              Next Question
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
