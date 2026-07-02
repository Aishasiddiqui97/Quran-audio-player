import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SurahSkeletonProps {
  viewMode?: "grid" | "list"
}

export function SurahSkeleton({ viewMode = "list" }: SurahSkeletonProps) {
  if (viewMode === "grid") {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/40 bg-card p-5">
            <div className="flex flex-col items-center text-center">
              <Skeleton className="h-14 w-14 rounded-2xl mb-4" />
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-3 w-16 mb-3" />
              <Skeleton className="h-6 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-border/40 bg-card p-4">
          <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="hidden sm:block h-6 w-16 rounded" />
        </div>
      ))}
    </div>
  )
}
