import type { AdSlot } from '@/lib/types';
import { AdSlotGrid } from './ad-slot-grid';
import { CreateAdSlotToggle } from './create-ad-slot-toggle';

interface AdSlotListProps {
  adSlots: AdSlot[];
}

export function AdSlotList({ adSlots }: AdSlotListProps) {
  if (adSlots.length === 0) {
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
        <CreateAdSlotToggle />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreateAdSlotToggle />
      <AdSlotGrid adSlots={adSlots} />
    </div>
  );
}
