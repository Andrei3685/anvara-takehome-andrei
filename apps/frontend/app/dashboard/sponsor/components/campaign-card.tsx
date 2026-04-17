'use client';

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { deleteCampaign, type ActionState } from '../actions';
import { CampaignForm } from './campaign-form';
import type { Campaign } from '@/lib/types';

interface CampaignCardProps {
  campaign: Campaign;
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  PAUSED: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  COMPLETED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

const statusIcons: Record<string, string> = {
  DRAFT: '📝',
  ACTIVE: '🟢',
  PAUSED: '⏸️',
  COMPLETED: '✅',
};

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {pending ? 'Deleting...' : 'Confirm Delete'}
    </button>
  );
}

const initialState: ActionState = {};

export function CampaignCard({ campaign }: CampaignCardProps) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteState, deleteAction] = useActionState(deleteCampaign, initialState);

  // Reset confirm state on success (check inline instead of useEffect)
  if (deleteState.success && confirmDelete) {
    setConfirmDelete(false);
  }

  if (editing) {
    return <CampaignForm campaign={campaign} onClose={() => setEditing(false)} />;
  }

  const progress =
    campaign.budget > 0 ? (Number(campaign.spent) / Number(campaign.budget)) * 100 : 0;

  return (
    <div className="group rounded-xl border border-[--color-border] p-5 transition-all hover:border-[--color-primary]/20 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="font-semibold">{campaign.name}</h3>
        <span
          className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[campaign.status] || 'bg-gray-100'}`}
        >
          <span className="text-xs">{statusIcons[campaign.status]}</span>
          {campaign.status}
        </span>
      </div>

      {campaign.description && (
        <p className="mb-4 text-sm text-[--color-muted] line-clamp-2">{campaign.description}</p>
      )}

      <div className="mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-[--color-muted]">Budget</span>
          <span className="font-medium">
            ${Number(campaign.spent).toLocaleString()} / ${Number(campaign.budget).toLocaleString()}
          </span>
        </div>
        <div className="mt-1.5 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-[--color-primary] to-[--color-primary-light] transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="text-xs text-[--color-muted]">
        {new Date(campaign.startDate).toLocaleDateString()} -{' '}
        {new Date(campaign.endDate).toLocaleDateString()}
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-[--color-border] pt-3">
        <button
          onClick={() => setEditing(true)}
          className="text-sm text-[--color-primary] transition-colors hover:text-[--color-primary-hover]"
        >
          Edit
        </button>

        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <form action={deleteAction}>
              <input type="hidden" name="id" value={campaign.id} />
              <DeleteButton />
            </form>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-sm text-[--color-muted] hover:underline"
            >
              Cancel
            </button>
            {deleteState.error && <span className="text-sm text-red-600">{deleteState.error}</span>}
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-sm text-red-600 transition-colors hover:text-red-800"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
