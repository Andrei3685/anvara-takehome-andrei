'use client';

import { useOptimistic, useCallback } from 'react';
import Link from 'next/link';
import type { Campaign } from '@/lib/types';
import { CampaignCard } from './campaign-card';
import { CreateCampaignToggle } from './create-campaign-toggle';

type OptimisticAction =
  | { type: 'delete'; id: string }
  | { type: 'add'; campaign: Campaign };

interface CampaignListProps {
  campaigns: Campaign[];
}

export function CampaignList({ campaigns }: CampaignListProps) {
  const [optimisticCampaigns, dispatchOptimistic] = useOptimistic(
    campaigns,
    (state: Campaign[], action: OptimisticAction) => {
      if (action.type === 'delete') {
        return state.filter((c) => c.id !== action.id);
      }
      if (action.type === 'add') {
        return [action.campaign, ...state];
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
      const budget = formData.get('budget') as string;
      const startDate = formData.get('startDate') as string;
      const endDate = formData.get('endDate') as string;

      const placeholderCampaign: Campaign = {
        id: `temp-${Date.now()}`,
        name: name || 'New Campaign',
        description: description || '',
        budget: Number(budget) || 0,
        spent: 0,
        startDate: startDate || new Date().toISOString(),
        endDate: endDate || new Date().toISOString(),
        status: 'DRAFT',
        targetCategories: [],
        targetRegions: [],
        sponsorId: '',
      };
      dispatchOptimistic({ type: 'add', campaign: placeholderCampaign });
    },
    [dispatchOptimistic]
  );

  if (optimisticCampaigns.length === 0 && campaigns.length === 0) {
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
        <CreateCampaignToggle onOptimisticCreate={onOptimisticCreate} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreateCampaignToggle onOptimisticCreate={onOptimisticCreate} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {optimisticCampaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onOptimisticDelete={onOptimisticDelete}
          />
        ))}
      </div>
    </div>
  );
}
