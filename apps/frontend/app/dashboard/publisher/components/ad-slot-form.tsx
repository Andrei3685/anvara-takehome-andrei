'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createAdSlot, updateAdSlot, type ActionState } from '../actions';
import type { AdSlot } from '@/lib/types';

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

interface AdSlotFormProps {
  adSlot?: AdSlot;
  onClose: () => void;
}

const initialState: ActionState = {};

export function AdSlotForm({ adSlot, onClose }: AdSlotFormProps) {
  const action = adSlot ? updateAdSlot : createAdSlot;
  const [state, formAction] = useActionState(action, initialState);

  if (state.success) {
    onClose();
    return null;
  }

  return (
    <form action={formAction} className="rounded-lg border border-[--color-border] p-4 space-y-4">
      <h3 className="font-semibold text-lg">{adSlot ? 'Edit Ad Slot' : 'Create New Ad Slot'}</h3>

      {adSlot && <input type="hidden" name="id" value={adSlot.id} />}

      {state.error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[--color-muted]">
          Slot Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={adSlot?.name || ''}
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
          defaultValue={adSlot?.description || ''}
          rows={2}
          className="mt-1 w-full rounded border border-[--color-border] bg-white px-3 py-2 text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-[--color-muted]">
          Type
        </label>
        <select
          id="type"
          name="type"
          defaultValue={adSlot?.type || 'DISPLAY'}
          className="mt-1 w-full rounded border border-[--color-border] bg-white px-3 py-2 text-gray-900"
        >
          <option value="DISPLAY">Display</option>
          <option value="VIDEO">Video</option>
          <option value="NATIVE">Native</option>
          <option value="NEWSLETTER">Newsletter</option>
          <option value="PODCAST">Podcast</option>
        </select>
        {state.fieldErrors?.type && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.type}</p>
        )}
      </div>

      <div>
        <label htmlFor="basePrice" className="block text-sm font-medium text-[--color-muted]">
          Base Price ($/month)
        </label>
        <input
          id="basePrice"
          name="basePrice"
          type="number"
          step="0.01"
          min="0.01"
          defaultValue={adSlot ? Number(adSlot.basePrice) : ''}
          className="mt-1 w-full rounded border border-[--color-border] bg-white px-3 py-2 text-gray-900"
        />
        {state.fieldErrors?.basePrice && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.basePrice}</p>
        )}
      </div>

      {adSlot && (
        <div>
          <label htmlFor="isAvailable" className="block text-sm font-medium text-[--color-muted]">
            Availability
          </label>
          <select
            id="isAvailable"
            name="isAvailable"
            defaultValue={adSlot.isAvailable ? 'true' : 'false'}
            className="mt-1 w-full rounded border border-[--color-border] bg-white px-3 py-2 text-gray-900"
          >
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
      )}

      <div className="flex gap-3">
        <SubmitButton label={adSlot ? 'Save Changes' : 'Create Ad Slot'} pendingLabel="Saving..." />
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
