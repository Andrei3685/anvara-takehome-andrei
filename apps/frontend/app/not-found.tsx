import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 text-6xl">🔍</div>
      <h1 className="mb-2 text-3xl font-bold">Page Not Found</h1>
      <p className="mb-8 max-w-md text-[--color-muted]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="rounded-lg bg-[--color-primary] px-6 py-2.5 font-medium text-white hover:opacity-90"
        >
          Go Home
        </Link>
        <Link
          href="/marketplace"
          className="rounded-lg border border-[--color-border] px-6 py-2.5 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Browse Marketplace
        </Link>
      </div>
    </div>
  );
}
