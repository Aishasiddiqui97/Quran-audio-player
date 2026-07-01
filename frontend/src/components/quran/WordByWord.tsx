"use client"

import { motion } from "framer-motion"
import type { WordByWord as WordByWordType } from "@/types"

interface WordByWordProps {
  words: WordByWordType[]
}

export function WordByWord({ words }: WordByWordProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="flex flex-wrap gap-2 border-t pt-3"
      dir="rtl"
    >
      {words.map((word, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center rounded-md border bg-muted/30 p-1.5 min-w-[48px]"
        >
          <span className="text-sm font-medium leading-relaxed" dir="rtl">
            {word.arabic}
          </span>
          {word.translation && (
            <span className="text-[10px] text-muted-foreground leading-tight mt-0.5" dir="ltr">
              {word.translation}
            </span>
          )}
        </div>
      ))}
    </motion.div>
  )
}
