'use client';

import { useOptimistic, useCallback } from 'react';
import type { AdSlot } from '@/lib/types';
import { AdSlotCard } from './ad-slot-card';
import { CreateAdSlotToggle } from './create-ad-slot-toggle';

type OptimisticAction =
  | { type: 'delete'; id: string }
  | { type: 'add'; adSlot: AdSlot };

interface AdSlotListProps {
  adSlots: AdSlot[];
}

export function AdSlotList({ adSlots }: AdSlotListProps) {
  const [optimisticSlots, dispatchOptimistic] = useOptimistic(
    adSlots,
    (state: AdSlot[], action: OptimisticAction) => {
      if (action.type === 'delete') {
        return state.filter((s) => s.id !== action.id);
      }
      if (action.type === 'add') {
        return [action.adSlot, ...state];
      }
      return state;
    }
  );

  const onOptimisticDelete = useCallback(
    (id: string) => {
      dispatchOptimistic({ type: 'delete', id });
    },
    [dispatchOptimistic]
  );

  const onOptimisticCreate = useCallback(
    (formData: FormData) => {
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const type = formData.get('type') as string;
      const basePrice = formData.get('basePrice') as string;

      const placeholderSlot: AdSlot = {
        id: `temp-${Date.now()}`,
        name: name || 'New Ad Slot',
        description: description || '',
        type: (type as AdSlot['type']) || 'DISPLAY',
        basePrice: Number(basePrice) || 0,
        isAvailable: true,
        publisherId: '',
      };
      dispatchOptimistic({ type: 'add', adSlot: placeholderSlot });
    },
    [dispatchOptimistic]
  );

  if (optimisticSlots.length === 0 && adSlots.length === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-dashed border-[--color-border] p-12 text-center">
          <div className="mb-3 text-5xl">📋</div>
          <h3 className="mb-2 text-lg font-semibold">No ad slots yet</h3>
          <p className="mx-auto mb-6 max-w-sm text-sm text-[--color-muted]">
            Create your first ad slot to start monetizing your audience. List display, video,
            newsletter, or podcast placements.
          </p>
        </div>
        <CreateAdSlotToggle onOptimisticCreate={onOptimisticCreate} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreateAdSlotToggle onOptimisticCreate={onOptimisticCreate} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {optimisticSlots.map((slot) => (
          <AdSlotCard key={slot.id} adSlot={slot} onOptimisticDelete={onOptimisticDelete} />
        ))}
      </div>
    </div>
  );
}
