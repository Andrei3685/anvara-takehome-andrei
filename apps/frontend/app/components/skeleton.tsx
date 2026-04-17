// Skeleton loading components for smooth loading states

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-[--color-border] p-4">
      <div className="mb-3 flex items-start justify-between">
        <div className="h-5 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-5 w-16 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="mb-3 space-y-2">
        <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-4/5 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-5 w-20 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="rounded-lg border border-[--color-border] p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-7 w-48 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="mb-6 space-y-2">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="border-t border-[--color-border] pt-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg border border-[--color-border] p-4">
          <div className="mb-2 h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-7 w-16 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      ))}
    </div>
  );
}
