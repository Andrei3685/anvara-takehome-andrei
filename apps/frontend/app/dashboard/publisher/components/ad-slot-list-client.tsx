'use client';

import { useOptimistic, useCallback, useTransition } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AdSlot } from '@/lib/types';
import { AdSlotCard } from './ad-slot-card';
import { CreateAdSlotToggle } from './create-ad-slot-toggle';
import { deleteAdSlot as deleteAdSlotAction, createAdSlot as createAdSlotAction, type ActionState } from '../actions';

type OptimisticAction =
  | { type: 'delete'; id: string }
  | { type: 'add'; adSlot: AdSlot };

interface AdSlotListClientProps {
  adSlots: AdSlot[];
}

export function AdSlotListClient({ adSlots }: AdSlotListClientProps) {
  const queryClient = useQueryClient();
  const [, startTransition] = useTransition();

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

  // useMutation for delete with cache invalidation and rollback
  const deleteMutation = useMutation<ActionState, Error, string>({
    mutationFn: async (id: string) => {
      const formData = new FormData();
      formData.set('id', id);
      return deleteAdSlotAction({}, formData);
    },
    onSuccess: (result) => {
      if (result.error) {
        queryClient.invalidateQueries({ queryKey: ['adSlots'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['adSlots'] });
      }
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['adSlots'] });
    },
  });

  // useMutation for create with cache invalidation
  const createMutation = useMutation<ActionState, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      return createAdSlotAction({}, formData);
    },
    onSuccess: (result) => {
      if (result.error) {
        queryClient.invalidateQueries({ queryKey: ['adSlots'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['adSlots'] });
      }
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['adSlots'] });
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

      startTransition(() => {
        dispatchOptimistic({ type: 'add', adSlot: placeholderSlot });
      });
      createMutation.mutate(formData);
    },
    [dispatchOptimistic, createMutation, startTransition]
  );

  return (
    <>
      <CreateAdSlotToggle onOptimisticCreate={onOptimisticCreate} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {optimisticSlots.map((slot) => (
          <AdSlotCard key={slot.id} adSlot={slot} onOptimisticDelete={onOptimisticDelete} />
        ))}
      </div>
    </>
  );
}
