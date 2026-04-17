// A/B Testing Framework
// Cookie-based variant assignment with consistent user experience

import { trackEvent } from './analytics';

type Variant = 'A' | 'B' | 'C';

interface Experiment {
  name: string;
  variants: Variant[];
  weights?: number[]; // e.g., [0.5, 0.5] for 50/50 split
}

const COOKIE_PREFIX = 'ab_';

/**
 * Get or set a cookie value
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days = 30): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Assign a variant based on weighted random selection
 */
function assignVariant(variants: Variant[], weights?: number[]): Variant {
  const normalizedWeights = weights || variants.map(() => 1 / variants.length);
  const random = Math.random();
  let cumulative = 0;

  for (let i = 0; i < variants.length; i++) {
    cumulative += normalizedWeights[i];
    if (random < cumulative) return variants[i];
  }

  return variants[variants.length - 1];
}

/**
 * Get the variant for a given experiment.
 * Assigns and persists on first call, returns cached variant thereafter.
 */
export function getVariant(experiment: Experiment): Variant {
  const cookieName = `${COOKIE_PREFIX}${experiment.name}`;

  // Check for existing assignment
  const existing = getCookie(cookieName);
  if (existing && experiment.variants.includes(existing as Variant)) {
    return existing as Variant;
  }

  // Assign new variant
  const variant = assignVariant(experiment.variants, experiment.weights);
  setCookie(cookieName, variant);

  // Track experiment exposure
  trackEvent({
    name: 'experiment_exposure',
    category: 'engagement',
    label: experiment.name,
    data: {
      experiment_name: experiment.name,
      variant,
    },
  });

  return variant;
}

/**
 * Force a specific variant (for debugging/testing)
 */
export function forceVariant(experimentName: string, variant: Variant): void {
  const cookieName = `${COOKIE_PREFIX}${experimentName}`;
  setCookie(cookieName, variant);
}

// Pre-defined experiments
export const experiments = {
  ctaButtonText: {
    name: 'cta-button-text',
    variants: ['A', 'B'] as Variant[],
    weights: [0.5, 0.5],
  },
  marketplaceLayout: {
    name: 'marketplace-layout',
    variants: ['A', 'B'] as Variant[],
    weights: [0.5, 0.5],
  },
  pricingDisplay: {
    name: 'pricing-display',
    variants: ['A', 'B'] as Variant[],
    weights: [0.5, 0.5],
  },
} satisfies Record<string, Experiment>;
