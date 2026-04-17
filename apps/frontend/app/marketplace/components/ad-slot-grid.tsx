'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { getAdSlots } from '@/lib/api';
import { analytics } from '@/lib/analytics';
import { SkeletonGrid } from '@/app/components/skeleton';
import { NewsletterForm } from '@/app/components/newsletter-form';
import type { AdSlot } from '@/lib/types';

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  VIDEO: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  NATIVE: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  NEWSLETTER: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  PODCAST: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

const typeIcons: Record<string, string> = {
  DISPLAY: '🖥️',
  VIDEO: '🎬',
  NATIVE: '📝',
  NEWSLETTER: '📧',
  PODCAST: '🎙️',
};

const ITEMS_PER_PAGE = 9;

export function AdSlotGrid() {
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    analytics.viewMarketplace();
    getAdSlots()
      .then(setAdSlots)
      .catch(() => setError('Failed to load ad slots'))
      .finally(() => setLoading(false));
  }, []);

  // Filter and search
  const filtered = useMemo(() => {
    return adSlots.filter((slot) => {
      if (typeFilter !== 'ALL' && slot.type !== typeFilter) return false;
      if (availableOnly && !slot.isAvailable) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          slot.name.toLowerCase().includes(q) ||
          slot.description?.toLowerCase().includes(q) ||
          slot.publisher?.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [adSlots, search, typeFilter, availableOnly]);

  // Reset page when filters change (inline instead of useEffect)
  const filterKey = `${search}|${typeFilter}|${availableOnly}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    if (page !== 1) {
      setPage(1);
    }
  }

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedSlots = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (loading) {
    return <SkeletonGrid count={6} />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/20">
        <div className="mb-2 text-3xl">⚠️</div>
        <p className="mb-3 font-medium text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            getAdSlots()
              .then(setAdSlots)
              .catch(() => setError('Failed to load ad slots'))
              .finally(() => setLoading(false));
          }}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (adSlots.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[--color-border] p-12 text-center">
        <div className="mb-3 text-5xl">📭</div>
        <h3 className="mb-2 text-lg font-semibold">No ad slots available</h3>
        <p className="text-[--color-muted]">
          Check back soon — new publishers are joining every week.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[--color-muted]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name, publisher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[--color-border] bg-[--color-background] py-2.5 pl-10 pr-3 text-sm placeholder:text-[--color-muted] focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2.5 text-sm focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
        >
          <option value="ALL">All Types</option>
          <option value="DISPLAY">Display</option>
          <option value="VIDEO">Video</option>
          <option value="NATIVE">Native</option>
          <option value="NEWSLETTER">Newsletter</option>
          <option value="PODCAST">Podcast</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-[--color-muted]">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
            className="rounded border-[--color-border]"
          />
          Available only
        </label>
      </div>

      {/* Results count */}
      <p className="text-sm text-[--color-muted]">
        Showing {paginatedSlots.length} of {filtered.length} listing
        {filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      {paginatedSlots.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[--color-border] p-12 text-center">
          <div className="mb-3 text-4xl">🔍</div>
          <h3 className="mb-2 font-semibold">No matches found</h3>
          <p className="mb-4 text-sm text-[--color-muted]">Try adjusting your search or filters.</p>
          <button
            onClick={() => {
              setSearch('');
              setTypeFilter('ALL');
              setAvailableOnly(false);
            }}
            className="text-sm text-[--color-primary] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedSlots.map((slot) => (
            <Link
              key={slot.id}
              href={`/marketplace/${slot.id}`}
              onClick={() => analytics.clickListing(slot.id, slot.type)}
              className="group block rounded-xl border border-[--color-border] p-5 transition-all hover:-translate-y-0.5 hover:border-[--color-primary]/30 hover:shadow-lg"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{typeIcons[slot.type] || '📦'}</span>
                  <h3 className="font-semibold group-hover:text-[--color-primary]">{slot.name}</h3>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[slot.type] || 'bg-gray-100'}`}
                >
                  {slot.type}
                </span>
              </div>

              {slot.publisher && (
                <p className="mb-2 text-sm text-[--color-muted]">by {slot.publisher.name}</p>
              )}

              {slot.description && (
                <p className="mb-4 text-sm text-[--color-muted] line-clamp-2">{slot.description}</p>
              )}

              <div className="flex items-center justify-between border-t border-[--color-border] pt-3">
                <span
                  className={`flex items-center gap-1.5 text-sm font-medium ${slot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
                >
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${slot.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
                  />
                  {slot.isAvailable ? 'Available' : 'Booked'}
                </span>
                <div className="text-right">
                  <span className="text-lg font-bold text-[--color-primary]">
                    ${Number(slot.basePrice).toLocaleString()}
                  </span>
                  <span className="text-xs text-[--color-muted]">/mo</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-[--color-border] px-3 py-1.5 text-sm disabled:opacity-40"
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                p === page
                  ? 'bg-[--color-primary] text-white'
                  : 'border border-[--color-border] hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-[--color-border] px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}

      {/* Newsletter CTA below grid */}
      <div className="mx-auto max-w-xl pt-4">
        <NewsletterForm />
      </div>
    </div>
  );
}
