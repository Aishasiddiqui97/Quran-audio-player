"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-destructive/10 to-destructive/5 mb-2">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <p className="text-8xl font-bold text-islamic-green/20 font-poppins">500</p>
          <h1 className="text-2xl font-semibold tracking-tight font-poppins">Something went wrong</h1>
          <p className="text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-islamic-green to-islamic-green-dark px-8 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg hover:scale-105"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-islamic-green/30 bg-background px-8 text-sm font-medium text-islamic-green shadow-sm transition-all hover:bg-islamic-green/5 hover:shadow-md"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
