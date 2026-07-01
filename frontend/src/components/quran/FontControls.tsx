"use client"

import { Minus, Plus, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useReaderStore,
  type ArabicFont,
  type TranslationLanguage,
} from "@/store/readerStore"

export function FontControls() {
  const {
    fontSize,
    arabicFont,
    translationLanguage,
    showWordByWord,
    showVerseNumber,
    setFontSize,
    setArabicFont,
    setTranslationLanguage,
    setShowWordByWord,
    setShowVerseNumber,
  } = useReaderStore()

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setFontSize(Math.max(14, fontSize - 2))}
          disabled={fontSize <= 14}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="flex items-center gap-1 text-xs text-muted-foreground min-w-[40px] justify-center">
          <Type className="h-3 w-3" />
          {fontSize}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setFontSize(Math.min(48, fontSize + 2))}
          disabled={fontSize >= 48}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Select
        value={arabicFont}
        onValueChange={(v) => setArabicFont(v as ArabicFont)}
      >
        <SelectTrigger className="h-8 w-[130px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="uthmani">Uthmani</SelectItem>
          <SelectItem value="simple">Simple</SelectItem>
          <SelectItem value="indopak">Indopak</SelectItem>
          <SelectItem value="nastaleeq">Nastaleeq</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={translationLanguage}
        onValueChange={(v) => setTranslationLanguage(v as TranslationLanguage)}
      >
        <SelectTrigger className="h-8 w-[110px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="ur">Urdu</SelectItem>
          <SelectItem value="off">Off</SelectItem>
        </SelectContent>
      </Select>

      <label className="flex items-center gap-1.5 cursor-pointer">
        <input
          type="checkbox"
          checked={showWordByWord}
          onChange={(e) => setShowWordByWord(e.target.checked)}
          className="h-3.5 w-3.5 rounded border-gray-300"
        />
        <span className="text-xs text-muted-foreground">Word</span>
      </label>

      <label className="flex items-center gap-1.5 cursor-pointer">
        <input
          type="checkbox"
          checked={showVerseNumber}
          onChange={(e) => setShowVerseNumber(e.target.checked)}
          className="h-3.5 w-3.5 rounded border-gray-300"
        />
        <span className="text-xs text-muted-foreground">#</span>
      </label>
    </div>
  )
}
