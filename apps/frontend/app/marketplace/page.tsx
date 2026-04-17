import type { Metadata } from 'next';
import { AdSlotGrid } from './components/ad-slot-grid';

export const metadata: Metadata = {
  title: 'Marketplace',
  description:
    'Browse available ad slots from premium publishers. Filter by type, price, and availability.',
};

export default function MarketplacePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <p className="text-[--color-muted]">Browse available ad slots from our publishers</p>
      </div>

      <AdSlotGrid />
    </div>
  );
}
