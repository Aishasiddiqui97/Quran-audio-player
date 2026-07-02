import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
}

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-islamic-green/10 to-islamic-gold/10 mb-2">
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-islamic-green" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6V6z"/>
          </svg>
        </div>
        <div className="space-y-2">
          <p className="text-8xl font-bold text-islamic-green/20 font-poppins">404</p>
          <h1 className="text-2xl font-semibold tracking-tight font-poppins">Page Not Found</h1>
          <p className="text-muted-foreground">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-islamic-green to-islamic-green-dark px-8 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg hover:scale-105"
          >
            Go Home
          </Link>
          <Link
            href="/surahs"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-islamic-green/30 bg-background px-8 text-sm font-medium text-islamic-green shadow-sm transition-all hover:bg-islamic-green/5 hover:shadow-md"
          >
            Browse Surahs
          </Link>
        </div>
      </div>
    </div>
  )
}
