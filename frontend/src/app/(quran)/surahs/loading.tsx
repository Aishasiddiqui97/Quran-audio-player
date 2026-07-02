import { Skeleton } from "@/components/ui/skeleton"

export default function SurahsLoading() {
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Hero Banner Skeleton */}
      <div className="mb-8 rounded-2xl border border-border/40 bg-card/30 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div>
            <Skeleton className="h-7 w-44 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-28 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Toolbar Skeleton */}
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="flex-1 h-11 rounded-xl" />
        <Skeleton className="h-11 w-20 rounded-xl" />
        <Skeleton className="h-11 w-28 rounded-xl" />
      </div>

      {/* Grid Skeleton */}
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
    </div>
  )
}
