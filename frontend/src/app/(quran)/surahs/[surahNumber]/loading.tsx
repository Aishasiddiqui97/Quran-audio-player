import { AyahSkeleton } from "@/components/quran/AyahSkeleton"

export default function SurahLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-48 animate-pulse rounded-xl bg-muted" />
        <AyahSkeleton />
      </div>
    </div>
  )
}
