'use client';

import { useState } from 'react';
import { AdSlotForm } from './ad-slot-form';

export function CreateAdSlotToggle() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-lg bg-[--color-primary] px-4 py-2 font-medium text-white shadow-md shadow-indigo-500/25 transition-all hover:opacity-90"
        >
          {showCreate ? 'Cancel' : '+ Create Ad Slot'}
        </button>
      </div>
      {showCreate && <AdSlotForm onClose={() => setShowCreate(false)} />}
    </div>
  );
}
