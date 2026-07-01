import { Skeleton } from "@/components/ui/skeleton"

export function SurahSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="hidden sm:block h-6 w-16" />
        </div>
      ))}
    </div>
  )
}
