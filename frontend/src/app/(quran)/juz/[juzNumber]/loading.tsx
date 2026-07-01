import { AyahSkeleton } from "@/components/quran/AyahSkeleton"

export default function JuzLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
        <AyahSkeleton />
      </div>
    </div>
  )
}
