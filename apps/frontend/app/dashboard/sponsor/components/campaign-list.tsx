'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Campaign } from '@/lib/types';
import { CampaignCard } from './campaign-card';
import { CampaignForm } from './campaign-form';

interface CampaignListProps {
  campaigns: Campaign[];
}

export function CampaignList({ campaigns }: CampaignListProps) {
  const [showCreate, setShowCreate] = useState(false);

  if (campaigns.length === 0 && !showCreate) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-dashed border-[--color-border] p-12 text-center">
          <div className="mb-3 text-5xl">📢</div>
          <h3 className="mb-2 text-lg font-semibold">No campaigns yet</h3>
          <p className="mx-auto mb-6 max-w-sm text-sm text-[--color-muted]">
            Create your first campaign to start reaching audiences through premium publishers.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => setShowCreate(true)}
              className="rounded-lg bg-[--color-primary] px-6 py-2.5 font-medium text-white shadow-md shadow-indigo-500/25 transition-all hover:opacity-90"
            >
              Create Campaign
            </button>
            <Link
              href="/marketplace"
              className="rounded-lg border border-[--color-border] px-6 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Browse Marketplace
            </Link>
          </div>
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
          {showCreate ? 'Cancel' : '+ Create Campaign'}
        </button>
      </div>

      {showCreate && <CampaignForm onClose={() => setShowCreate(false)} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}
