import Link from 'next/link';
import type { Campaign } from '@/lib/types';
import { CampaignGrid } from './campaign-grid';
import { CreateCampaignToggle } from './create-campaign-toggle';

interface CampaignListProps {
  campaigns: Campaign[];
}

export function CampaignList({ campaigns }: CampaignListProps) {
  if (campaigns.length === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-dashed border-[--color-border] p-12 text-center">
          <div className="mb-3 text-5xl">📢</div>
          <h3 className="mb-2 text-lg font-semibold">No campaigns yet</h3>
          <p className="mx-auto mb-6 max-w-sm text-sm text-[--color-muted]">
            Create your first campaign to start reaching audiences through premium publishers.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/marketplace"
              className="rounded-lg border border-[--color-border] px-6 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
        <CreateCampaignToggle />
      </div>    );
  }

  return (
    <div className="space-y-6">
      <CreateCampaignToggle />
      <CampaignGrid campaigns={campaigns} />
    </div>
  );
}
