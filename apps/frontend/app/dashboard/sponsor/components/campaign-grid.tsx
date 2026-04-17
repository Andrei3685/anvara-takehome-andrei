'use client';

import { useOptimistic, useCallback } from 'react';
import type { Campaign } from '@/lib/types';
import { CampaignCard } from './campaign-card';

interface CampaignGridProps {
  campaigns: Campaign[];
}

export function CampaignGrid({ campaigns }: CampaignGridProps) {
  const [optimisticCampaigns, removeOptimistic] = useOptimistic(
    campaigns,
    (state: Campaign[], removedId: string) => state.filter((c) => c.id !== removedId)
  );

  const onOptimisticDelete = useCallback(
    (id: string) => {
      removeOptimistic(id);
    },
    [removeOptimistic]
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {optimisticCampaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onOptimisticDelete={onOptimisticDelete}
        />
      ))}
    </div>
  );
}
