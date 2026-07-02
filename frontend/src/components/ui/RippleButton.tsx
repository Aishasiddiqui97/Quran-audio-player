"use client"

import { useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Ripple {
  id: number
  x: number
  y: number
}

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline"
  size?: "sm" | "md" | "lg" | "icon"
  children: React.ReactNode
}

export function RippleButton({
  variant = "primary",
  size = "md",
  className,
  children,
  onClick,
  ...props
}: RippleButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const idRef = useRef(0)

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = idRef.current++
      setRipples((prev) => [...prev, { id, x, y }])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 600)
      onClick?.(e)
    },
    [onClick]
  )

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-islamic-green to-islamic-green-dark text-white shadow-lg hover:shadow-xl hover:from-islamic-green-dark hover:to-islamic-green",
    secondary:
      "bg-islamic-green/10 text-islamic-green hover:bg-islamic-green hover:text-white border border-islamic-green/20",
    ghost:
      "bg-transparent text-muted-foreground hover:bg-islamic-green/5 hover:text-islamic-green",
    outline:
      "border border-border/60 bg-background hover:border-islamic-green/30 hover:bg-islamic-green/5 text-foreground",
  }

  const sizeStyles = {
    sm: "h-9 px-3 text-xs rounded-lg",
    md: "h-10 px-5 text-sm rounded-xl",
    lg: "h-12 px-7 text-base rounded-xl",
    icon: "h-10 w-10 rounded-xl",
  }

  return (
    <button
      ref={buttonRef}
      className={cn(
        "relative overflow-hidden inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-[0.97]",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute pointer-events-none rounded-full bg-white/30"
            style={{
              left: ripple.x - 8,
              top: ripple.y - 8,
              width: 16,
              height: 16,
            }}
          />
        ))}
      </AnimatePresence>
    </button>
  )
}
