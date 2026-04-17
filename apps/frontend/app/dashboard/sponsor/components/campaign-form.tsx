'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createCampaign, updateCampaign, type ActionState } from '../actions';
import type { Campaign } from '@/lib/types';

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-[--color-primary] px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

interface CampaignFormProps {
  campaign?: Campaign;
  onClose: () => void;
}

const initialState: ActionState = {};

export function CampaignForm({ campaign, onClose }: CampaignFormProps) {
  const action = campaign ? updateCampaign : createCampaign;
  const [state, formAction] = useActionState(action, initialState);

  if (state.success) {
    onClose();
    return null;
  }

  const defaultStartDate = campaign ? new Date(campaign.startDate).toISOString().split('T')[0] : '';
  const defaultEndDate = campaign ? new Date(campaign.endDate).toISOString().split('T')[0] : '';

  return (
    <form action={formAction} className="rounded-lg border border-[--color-border] p-4 space-y-4">
      <h3 className="font-semibold text-lg">
        {campaign ? 'Edit Campaign' : 'Create New Campaign'}
      </h3>

      {campaign && <input type="hidden" name="id" value={campaign.id} />}

      {state.error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[--color-muted]">
          Campaign Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={campaign?.name || ''}
          className="mt-1 w-full rounded border border-[--color-border] bg-white px-3 py-2 text-gray-900"
        />
        {state.fieldErrors?.name && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[--color-muted]">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={campaign?.description || ''}
          rows={2}
          className="mt-1 w-full rounded border border-[--color-border] bg-white px-3 py-2 text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-[--color-muted]">
          Budget ($)
        </label>
        <input
          id="budget"
          name="budget"
          type="number"
          step="0.01"
          min="0.01"
          defaultValue={campaign ? Number(campaign.budget) : ''}
          className="mt-1 w-full rounded border border-[--color-border] bg-white px-3 py-2 text-gray-900"
        />
        {state.fieldErrors?.budget && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.budget}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-[--color-muted]">
            Start Date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={defaultStartDate}
            className="mt-1 w-full rounded border border-[--color-border] bg-white px-3 py-2 text-gray-900"
          />
          {state.fieldErrors?.startDate && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.startDate}</p>
          )}
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-[--color-muted]">
            End Date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={defaultEndDate}
            className="mt-1 w-full rounded border border-[--color-border] bg-white px-3 py-2 text-gray-900"
          />
          {state.fieldErrors?.endDate && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.endDate}</p>
          )}
        </div>
      </div>

      {campaign && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-[--color-muted]">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={campaign.status}
            className="mt-1 w-full rounded border border-[--color-border] bg-white px-3 py-2 text-gray-900"
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      )}

      <div className="flex gap-3">
        <SubmitButton
          label={campaign ? 'Save Changes' : 'Create Campaign'}
          pendingLabel="Saving..."
        />
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-[--color-border] px-4 py-2 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
