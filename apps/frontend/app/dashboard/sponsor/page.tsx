import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { CampaignList } from './components/campaign-list';
import type { Campaign } from '@/lib/types';

export const metadata: Metadata = {
  title: 'My Campaigns',
  description: 'Manage your sponsorship campaigns on Anvara.',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

async function getCampaigns(sponsorId: string, cookieHeader: string): Promise<Campaign[]> {
  try {
    const res = await fetch(`${API_URL}/api/campaigns?sponsorId=${sponsorId}`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function SponsorDashboard() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session?.user) {
    redirect('/login');
  }

  const roleData = await getUserRole(session.user.id);
  if (roleData.role !== 'sponsor' || !roleData.sponsorId) {
    redirect('/');
  }

  const cookieHeader = reqHeaders.get('cookie') || '';
  const campaigns = await getCampaigns(roleData.sponsorId, cookieHeader);

  const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE').length;
  const totalBudget = campaigns.reduce((sum, c) => sum + Number(c.budget), 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + Number(c.spent), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Campaigns</h1>
          <p className="text-sm text-[--color-muted]">Manage your sponsorship campaigns</p>
        </div>
      </div>

      {/* Stats overview */}
      {campaigns.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[--color-border] p-4">
            <p className="text-sm text-[--color-muted]">Active Campaigns</p>
            <p className="mt-1 text-2xl font-bold text-[--color-primary]">{activeCampaigns}</p>
          </div>
          <div className="rounded-xl border border-[--color-border] p-4">
            <p className="text-sm text-[--color-muted]">Total Budget</p>
            <p className="mt-1 text-2xl font-bold">${totalBudget.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-[--color-border] p-4">
            <p className="text-sm text-[--color-muted]">Total Spent</p>
            <p className="mt-1 text-2xl font-bold">${totalSpent.toLocaleString()}</p>
            {totalBudget > 0 && (
              <div className="mt-2 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-1.5 rounded-full bg-[--color-primary]"
                  style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <CampaignList campaigns={campaigns} />
    </div>
  );
}
