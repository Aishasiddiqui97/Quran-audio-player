export default function AILoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto flex max-w-5xl gap-4">
        <div className="hidden w-64 shrink-0 md:block">
          <div className="h-96 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-12 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  )
}
