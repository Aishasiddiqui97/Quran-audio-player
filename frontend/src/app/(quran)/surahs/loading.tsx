import { SurahSkeleton } from "@/components/quran/SurahSkeleton"

export default function SurahsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-5 w-72 animate-pulse rounded-lg bg-muted" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
        <div className="space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <SurahSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
