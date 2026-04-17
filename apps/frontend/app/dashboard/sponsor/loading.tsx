import { SkeletonStats, SkeletonGrid } from '@/app/components/skeleton';

export default function SponsorDashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-7 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <SkeletonStats />
      <SkeletonGrid count={3} />
    </div>
  );
}
