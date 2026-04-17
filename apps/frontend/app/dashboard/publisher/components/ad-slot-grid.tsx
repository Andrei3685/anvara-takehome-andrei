'use client';

import { useOptimistic, useCallback } from 'react';
import type { AdSlot } from '@/lib/types';
import { AdSlotCard } from './ad-slot-card';

interface AdSlotGridProps {
  adSlots: AdSlot[];
}

export function AdSlotGrid({ adSlots }: AdSlotGridProps) {
  const [optimisticSlots, removeOptimistic] = useOptimistic(
    adSlots,
    (state: AdSlot[], removedId: string) => state.filter((s) => s.id !== removedId)
  );

  const onOptimisticDelete = useCallback(
    (id: string) => {
      removeOptimistic(id);
    },
    [removeOptimistic]
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {optimisticSlots.map((slot) => (
        <AdSlotCard key={slot.id} adSlot={slot} onOptimisticDelete={onOptimisticDelete} />
      ))}
    </div>
  );
}
