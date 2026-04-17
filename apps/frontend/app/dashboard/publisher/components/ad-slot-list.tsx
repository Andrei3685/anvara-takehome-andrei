'use client';

import { useState } from 'react';
import type { AdSlot } from '@/lib/types';
import { AdSlotCard } from './ad-slot-card';
import { AdSlotForm } from './ad-slot-form';

interface AdSlotListProps {
  adSlots: AdSlot[];
}

export function AdSlotList({ adSlots }: AdSlotListProps) {
  const [showCreate, setShowCreate] = useState(false);

  if (adSlots.length === 0 && !showCreate) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-dashed border-[--color-border] p-12 text-center">
          <div className="mb-3 text-5xl">📋</div>
          <h3 className="mb-2 text-lg font-semibold">No ad slots yet</h3>
          <p className="mx-auto mb-6 max-w-sm text-sm text-[--color-muted]">
            Create your first ad slot to start monetizing your audience. List display, video,
            newsletter, or podcast placements.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-lg bg-[--color-primary] px-6 py-2.5 font-medium text-white shadow-md shadow-indigo-500/25 transition-all hover:opacity-90"
          >
            Create Ad Slot
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-lg bg-[--color-primary] px-4 py-2 font-medium text-white shadow-md shadow-indigo-500/25 transition-all hover:opacity-90"
        >
          {showCreate ? 'Cancel' : '+ Create Ad Slot'}
        </button>
      </div>

      {showCreate && <AdSlotForm onClose={() => setShowCreate(false)} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adSlots.map((slot) => (
          <AdSlotCard key={slot.id} adSlot={slot} />
        ))}
      </div>
    </div>
  );
}
