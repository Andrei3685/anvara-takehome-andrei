'use client';

import { useState, useEffect } from 'react';
import { getVariant, type experiments } from '@/lib/ab-testing';

type Variant = 'A' | 'B' | 'C';

/**
 * React hook for A/B testing.
 * Returns the assigned variant for an experiment, persisted via cookie.
 *
 * Usage:
 *   const variant = useABTest(experiments.ctaButtonText);
 *   return <button>{variant === 'A' ? 'Book Now' : 'Get Started'}</button>;
 */
export function useABTest(experiment: (typeof experiments)[keyof typeof experiments]): Variant {
  const [variant, setVariant] = useState<Variant>('A');

  useEffect(() => {
    setVariant(getVariant(experiment));
  }, [experiment]);

  return variant;
}
