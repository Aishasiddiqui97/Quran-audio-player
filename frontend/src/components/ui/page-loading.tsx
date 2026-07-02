import { cn } from "@/lib/utils"

interface PageLoadingProps {
  className?: string
}

export function PageLoading({ className }: PageLoadingProps) {
  return (
    <div className={cn("container mx-auto px-4 py-8", className)}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="relative flex items-center justify-center">
            <div className="h-16 w-16 rounded-full border-4 border-islamic-green/20 border-t-islamic-green animate-islamic-spin" />
            <div className="absolute h-10 w-10 rounded-full border-4 border-islamic-gold/20 border-t-islamic-gold animate-islamic-spin" style={{ animationDirection: "reverse", animationDuration: "1s" }} />
            <div className="absolute h-4 w-4 rounded-full bg-gradient-to-br from-islamic-green to-islamic-gold" />
          </div>
        </div>
      </div>
    </div>
  )
}
