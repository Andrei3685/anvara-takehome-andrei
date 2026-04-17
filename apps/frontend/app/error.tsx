'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for debugging and monitoring
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 text-6xl">⚠️</div>
      <h1 className="mb-2 text-3xl font-bold">Something went wrong</h1>
      <p className="mb-8 max-w-md text-[--color-muted]">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-[--color-primary] px-6 py-2.5 font-medium text-white hover:opacity-90"
      >
        Try Again
      </button>
    </div>
  );
}
