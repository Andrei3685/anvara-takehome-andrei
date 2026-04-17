'use client';

import { useState } from 'react';
import { CampaignForm } from './campaign-form';

export function CreateCampaignToggle() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-lg bg-[--color-primary] px-4 py-2 font-medium text-white shadow-md shadow-indigo-500/25 transition-all hover:opacity-90"
        >
          {showCreate ? 'Cancel' : '+ Create Campaign'}
        </button>
      </div>
      {showCreate && <CampaignForm onClose={() => setShowCreate(false)} />}
    </div>
  );
}

export function EmptyStateCampaignToggle() {
  const [showCreate, setShowCreate] = useState(false);

  if (showCreate) {
    return (
      <div className="space-y-4">
        <CampaignForm onClose={() => setShowCreate(false)} />
      </div>
    );
  }

  return null;
}

export function CreateCampaignButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg bg-[--color-primary] px-6 py-2.5 font-medium text-white shadow-md shadow-indigo-500/25 transition-all hover:opacity-90"
    >
      Create Campaign
    </button>
  );
}
