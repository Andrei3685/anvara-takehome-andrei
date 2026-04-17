// Analytics utility for tracking conversions and user events
// Supports GA4, custom events, and conversion funnel tracking

type EventCategory = 'marketplace' | 'booking' | 'engagement' | 'conversion' | 'navigation';

interface AnalyticsEvent {
  name: string;
  category: EventCategory;
  label?: string;
  value?: number;
  data?: Record<string, string | number | boolean | undefined>;
}

// GA4 gtag type
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

/**
 * Initialize Google Analytics 4
 * Called once in the GA4 script component
 */
export function initGA4(): void {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
}

/**
 * Track a custom event via GA4 and log in dev
 */
export function trackEvent({ name, category, label, value, data }: AnalyticsEvent): void {
  // Don't block the user interaction
  if (typeof window === 'undefined') return;

  const eventData = {
    event_category: category,
    ...(label && { event_label: label }),
    ...(value !== undefined && { value }),
    ...data,
  };

  // GA4 tracking
  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', name, eventData);
  }

  // Dev logging
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(`[Analytics] ${name}`, eventData);
  }
}

/**
 * Track page views for SPA navigation
 */
export function trackPageView(url: string, title?: string): void {
  trackEvent({
    name: 'page_view',
    category: 'navigation',
    data: {
      page_path: url,
      page_title: title || document.title,
    },
  });
}

// Pre-defined conversion events for the marketplace
export const analytics = {
  // Marketplace funnel
  viewMarketplace: () => trackEvent({ name: 'view_marketplace', category: 'marketplace' }),

  viewListing: (slotId: string, slotName: string, price: number) =>
    trackEvent({
      name: 'view_listing',
      category: 'marketplace',
      label: slotName,
      value: price,
      data: { slot_id: slotId },
    }),

  clickListing: (slotId: string, slotType: string) =>
    trackEvent({
      name: 'click_listing',
      category: 'marketplace',
      data: { slot_id: slotId, slot_type: slotType },
    }),

  // Booking funnel (macro-conversion)
  startBooking: (slotId: string, price: number) =>
    trackEvent({
      name: 'begin_checkout',
      category: 'booking',
      value: price,
      data: { slot_id: slotId },
    }),

  completeBooking: (slotId: string, price: number) =>
    trackEvent({
      name: 'purchase',
      category: 'conversion',
      value: price,
      data: { slot_id: slotId },
    }),

  // Quote request (micro-conversion)
  requestQuote: (slotId: string) =>
    trackEvent({
      name: 'generate_lead',
      category: 'conversion',
      data: { slot_id: slotId, lead_type: 'quote' },
    }),

  // Newsletter signup (micro-conversion)
  newsletterSignup: () =>
    trackEvent({
      name: 'sign_up',
      category: 'conversion',
      data: { method: 'newsletter' },
    }),

  // Engagement
  ctaClick: (ctaName: string, location: string) =>
    trackEvent({
      name: 'cta_click',
      category: 'engagement',
      label: ctaName,
      data: { location },
    }),

  // Campaign management
  createCampaign: () => trackEvent({ name: 'create_campaign', category: 'engagement' }),

  createAdSlot: () => trackEvent({ name: 'create_ad_slot', category: 'engagement' }),
};
