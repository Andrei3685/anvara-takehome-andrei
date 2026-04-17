'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getAdSlot } from '@/lib/api';
import { authClient } from '@/auth-client';
import { analytics } from '@/lib/analytics';
import { useABTest } from '@/hooks/use-ab-test';
import { experiments } from '@/lib/ab-testing';
import { QuoteModal } from '@/app/components/quote-modal';
import { SkeletonDetail } from '@/app/components/skeleton';

interface AdSlot {
  id: string;
  name: string;
  description?: string;
  type: string;
  basePrice: number;
  isAvailable: boolean;
  publisher?: {
    id: string;
    name: string;
    website?: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface RoleInfo {
  role: 'sponsor' | 'publisher' | null;
  sponsorId?: string;
  publisherId?: string;
  name?: string;
}

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NATIVE: 'bg-teal-100 text-teal-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
};

const typeIcons: Record<string, string> = {
  DISPLAY: '🖥️',
  VIDEO: '🎬',
  NATIVE: '📝',
  NEWSLETTER: '📧',
  PODCAST: '🎙️',
};

interface Props {
  id: string;
}

async function fetchRoleInfo(userId: string): Promise<RoleInfo | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/auth/role/${userId}`
    );
    return await res.json();
  } catch {
    return null;
  }
}

export function AdSlotDetail({ id }: Props) {
  const [message, setMessage] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [localAdSlot, setLocalAdSlot] = useState<AdSlot | null>(null);

  // A/B test for CTA button text
  const ctaVariant = useABTest(experiments.ctaButtonText);

  // Fetch ad slot via React Query
  const {
    data: fetchedAdSlot,
    isLoading: loading,
    error,
  } = useQuery<AdSlot>({
    queryKey: ['adSlot', id],
    queryFn: async () => {
      const slot = await getAdSlot(id);
      analytics.viewListing(slot.id, slot.name, Number(slot.basePrice));
      return slot as unknown as AdSlot;
    },
  });

  const adSlot = localAdSlot ?? fetchedAdSlot ?? null;

  // Fetch user session
  const { data: session } = authClient.useSession();
  const user = (session?.user as User) ?? null;

  // Fetch role info via React Query
  const { data: roleInfo = null, isLoading: roleLoading } = useQuery<RoleInfo | null>({
    queryKey: ['roleInfo', user?.id],
    queryFn: () => fetchRoleInfo(user!.id),
    enabled: !!user?.id,
  });

  const handleBooking = async () => {
    if (!roleInfo?.sponsorId || !adSlot) return;

    setBooking(true);
    setBookingError(null);
    analytics.startBooking(adSlot.id, Number(adSlot.basePrice));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/ad-slots/${adSlot.id}/book`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sponsorId: roleInfo.sponsorId,
            message: message || undefined,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to book placement');
      }

      setBookingSuccess(true);
      setLocalAdSlot({ ...adSlot, isAvailable: false });
      analytics.completeBooking(adSlot.id, Number(adSlot.basePrice));
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Failed to book placement');
    } finally {
      setBooking(false);
    }
  };

  const handleUnbook = async () => {
    if (!adSlot) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/ad-slots/${adSlot.id}/unbook`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to reset booking');
      }

      setBookingSuccess(false);
      setLocalAdSlot({ ...adSlot, isAvailable: true });
      setMessage('');
    } catch {
      // Silently fail — user can retry
    }
  };

  if (loading) {
    return <SkeletonDetail />;
  }

  if (error || !adSlot) {
    return (
      <div className="space-y-4">
        <Link href="/marketplace" className="text-[--color-primary] hover:underline">
          ← Back to Marketplace
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/20">
          <div className="mb-2 text-3xl">😕</div>
          <p className="mb-3 font-medium text-red-600 dark:text-red-400">
            {error ? 'Failed to load ad slot details' : 'Ad slot not found'}
          </p>
          <Link
            href="/marketplace"
            className="inline-block rounded-lg bg-[--color-primary] px-4 py-2 text-sm text-white hover:opacity-90"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const ctaText = ctaVariant === 'A' ? 'Book This Placement' : 'Get Started Now';
  const ctaPendingText = ctaVariant === 'A' ? 'Booking...' : 'Processing...';

  return (
    <div className="space-y-6">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1 text-[--color-primary] hover:underline"
      >
        ← Back to Marketplace
      </Link>

      <div className="rounded-xl border border-[--color-border] p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-2xl">{typeIcons[adSlot.type] || '📦'}</span>
              <h1 className="text-2xl font-bold">{adSlot.name}</h1>
            </div>
            {adSlot.publisher && (
              <p className="text-[--color-muted]">
                by {adSlot.publisher.name}
                {adSlot.publisher.website && (
                  <>
                    {' '}
                    ·{' '}
                    <a
                      href={adSlot.publisher.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[--color-primary] hover:underline"
                    >
                      {adSlot.publisher.website}
                    </a>
                  </>
                )}
              </p>
            )}
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${typeColors[adSlot.type] || 'bg-gray-100'}`}
          >
            {adSlot.type}
          </span>
        </div>

        {adSlot.description && <p className="mb-6 text-[--color-muted]">{adSlot.description}</p>}

        <div className="flex items-center justify-between border-t border-[--color-border] pt-4">
          <div>
            <span
              className={`flex items-center gap-2 text-sm font-medium ${adSlot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
            >
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${adSlot.isAvailable ? 'animate-pulse bg-green-500' : 'bg-gray-300'}`}
              />
              {adSlot.isAvailable ? 'Available Now' : 'Currently Booked'}
            </span>
            {!adSlot.isAvailable && !bookingSuccess && (
              <button
                onClick={handleUnbook}
                className="ml-3 text-sm text-[--color-primary] underline hover:opacity-80"
              >
                Reset listing
              </button>
            )}
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[--color-primary]">
              ${Number(adSlot.basePrice).toLocaleString()}
            </p>
            <p className="text-sm text-[--color-muted]">per month</p>
          </div>
        </div>

        {adSlot.isAvailable && !bookingSuccess && (
          <div className="mt-6 border-t border-[--color-border] pt-6">
            <h2 className="mb-4 text-lg font-semibold">Request This Placement</h2>

            {roleLoading ? (
              <div className="py-4 text-center text-[--color-muted]">Loading...</div>
            ) : roleInfo?.role === 'sponsor' && roleInfo?.sponsorId ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[--color-muted]">
                    Your Company
                  </label>
                  <p className="text-[--color-foreground]">{roleInfo.name || user?.name}</p>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1 block text-sm font-medium text-[--color-muted]"
                  >
                    Message to Publisher (optional)
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell the publisher about your campaign goals..."
                    className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-[--color-foreground] placeholder:text-[--color-muted] focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
                    rows={3}
                  />
                </div>
                {bookingError && <p className="text-sm text-red-600">{bookingError}</p>}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleBooking}
                    disabled={booking}
                    className="flex-1 rounded-lg bg-[--color-primary] px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:opacity-90 disabled:opacity-50"
                  >
                    {booking ? ctaPendingText : ctaText}
                  </button>
                  <button
                    onClick={() => {
                      setShowQuoteModal(true);
                      analytics.ctaClick('request_quote', 'detail_page');
                    }}
                    className="rounded-lg border border-[--color-border] px-4 py-3 font-semibold transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Request a Quote
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowQuoteModal(true);
                    analytics.ctaClick('request_quote_unauth', 'detail_page');
                  }}
                  className="w-full rounded-lg border-2 border-[--color-primary] px-4 py-3 font-semibold text-[--color-primary] transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
                >
                  Request a Quote
                </button>
                {user ? (
                  <p className="text-center text-sm text-[--color-muted]">
                    Only sponsors can book directly. You can still request a quote.
                  </p>
                ) : (
                  <p className="text-center text-sm text-[--color-muted]">
                    <Link href="/login" className="text-[--color-primary] hover:underline">
                      Log in
                    </Link>{' '}
                    as a sponsor to book directly, or request a quote below.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {bookingSuccess && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/20">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-400">
                  Placement Booked!
                </h3>
                <p className="mt-1 text-sm text-green-700 dark:text-green-500">
                  Your request has been submitted. The publisher will be in touch soon.
                </p>
                <button
                  onClick={handleUnbook}
                  className="mt-3 text-sm text-green-700 underline hover:text-green-800 dark:text-green-500"
                >
                  Remove Booking (reset for testing)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showQuoteModal && (
        <QuoteModal
          adSlotId={adSlot.id}
          adSlotName={adSlot.name}
          onClose={() => setShowQuoteModal(false)}
        />
      )}
    </div>
  );
}
