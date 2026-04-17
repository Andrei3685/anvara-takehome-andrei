'use client';

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { deleteAdSlot, type ActionState } from '../actions';
import { AdSlotForm } from './ad-slot-form';
import type { AdSlot } from '@/lib/types';

interface AdSlotCardProps {
  adSlot: AdSlot;
}

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  VIDEO: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  NATIVE: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  NEWSLETTER: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  PODCAST: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

const typeIcons: Record<string, string> = {
  DISPLAY: '🖥️',
  VIDEO: '🎬',
  NATIVE: '📝',
  NEWSLETTER: '📧',
  PODCAST: '🎙️',
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

export function AdSlotCard({ adSlot }: AdSlotCardProps) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteState, deleteAction] = useActionState(deleteAdSlot, initialState);

  if (deleteState.success && confirmDelete) {
    setConfirmDelete(false);
  }

  if (editing) {
    return <AdSlotForm adSlot={adSlot} onClose={() => setEditing(false)} />;
  }

  return (
    <div className="group rounded-xl border border-[--color-border] p-5 transition-all hover:border-[--color-primary]/20 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span>{typeIcons[adSlot.type] || '📦'}</span>
          <h3 className="font-semibold">{adSlot.name}</h3>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[adSlot.type] || 'bg-gray-100'}`}
        >
          {adSlot.type}
        </span>
      </div>

      {adSlot.description && (
        <p className="mb-4 text-sm text-[--color-muted] line-clamp-2">{adSlot.description}</p>
      )}

      <div className="flex items-center justify-between">
        <span
          className={`flex items-center gap-1.5 text-sm font-medium ${adSlot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
        >
          <span
            className={`inline-block h-2 w-2 rounded-full ${adSlot.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
          />
          {adSlot.isAvailable ? 'Available' : 'Booked'}
        </span>
        <div className="text-right">
          <span className="text-lg font-bold text-[--color-primary]">
            ${Number(adSlot.basePrice).toLocaleString()}
          </span>
          <span className="text-xs text-[--color-muted]">/mo</span>
        </div>
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
              <input type="hidden" name="id" value={adSlot.id} />
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
