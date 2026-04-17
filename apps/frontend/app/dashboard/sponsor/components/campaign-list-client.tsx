'use client';

import { useOptimistic, useCallback, useTransition } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Campaign } from '@/lib/types';
import { CampaignCard } from './campaign-card';
import { CreateCampaignToggle } from './create-campaign-toggle';
import { deleteCampaign as deleteCampaignAction, createCampaign as createCampaignAction, type ActionState } from '../actions';

type OptimisticAction =
  | { type: 'delete'; id: string }
  | { type: 'add'; campaign: Campaign };

interface CampaignListClientProps {
  campaigns: Campaign[];
}

export function CampaignListClient({ campaigns }: CampaignListClientProps) {
  const queryClient = useQueryClient();
  const [, startTransition] = useTransition();

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

  // useMutation for delete with cache invalidation and rollback
  const deleteMutation = useMutation<ActionState, Error, string>({
    mutationFn: async (id: string) => {
      const formData = new FormData();
      formData.set('id', id);
      return deleteCampaignAction({}, formData);
    },
    onSuccess: (result) => {
      if (result.error) {
        // Server action returned an error — rollback by invalidating cache
        queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      }
    },
    onError: () => {
      // Network error — rollback by invalidating cache
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });

  // useMutation for create with cache invalidation
  const createMutation = useMutation<ActionState, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      return createCampaignAction({}, formData);
    },
    onSuccess: (result) => {
      if (result.error) {
        queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      }
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });

  const onOptimisticDelete = useCallback(
    (id: string) => {
      startTransition(() => {
        dispatchOptimistic({ type: 'delete', id });
      });
      deleteMutation.mutate(id);
    },
    [dispatchOptimistic, deleteMutation, startTransition]
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

      startTransition(() => {
        dispatchOptimistic({ type: 'add', campaign: placeholderCampaign });
      });
      createMutation.mutate(formData);
    },
    [dispatchOptimistic, createMutation, startTransition]
  );

  return (
    <>
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
    </>
  );
}
