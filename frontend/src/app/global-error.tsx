"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="space-y-6 max-w-md">
            <div className="space-y-2">
              <p className="text-8xl font-bold text-destructive/20">500</p>
              <h1 className="text-2xl font-semibold tracking-tight">
                Critical Error
              </h1>
              <p className="text-muted-foreground">
                A critical error occurred. Please refresh the page.
              </p>
            </div>
            <button
              onClick={() => reset()}
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
