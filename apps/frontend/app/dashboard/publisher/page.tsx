import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { AdSlotList } from './components/ad-slot-list';
import type { AdSlot } from '@/lib/types';

export const metadata: Metadata = {
  title: 'My Ad Slots',
  description: 'Manage your ad slots and monetize your audience on Anvara.',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

async function getAdSlots(publisherId: string, cookieHeader: string): Promise<AdSlot[]> {
  try {
    const res = await fetch(`${API_URL}/api/ad-slots?publisherId=${publisherId}`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function PublisherDashboard() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session?.user) {
    redirect('/login');
  }

  const roleData = await getUserRole(session.user.id);
  if (roleData.role !== 'publisher' || !roleData.publisherId) {
    redirect('/');
  }

  const cookieHeader = reqHeaders.get('cookie') || '';
  const adSlots = await getAdSlots(roleData.publisherId, cookieHeader);

  const availableSlots = adSlots.filter((s) => s.isAvailable).length;
  const totalRevenue = adSlots.reduce((sum, s) => sum + Number(s.basePrice), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Ad Slots</h1>
          <p className="text-sm text-[--color-muted]">Manage your ad inventory</p>
        </div>
      </div>

      {/* Stats overview */}
      {adSlots.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[--color-border] p-4">
            <p className="text-sm text-[--color-muted]">Total Listings</p>
            <p className="mt-1 text-2xl font-bold">{adSlots.length}</p>
          </div>
          <div className="rounded-xl border border-[--color-border] p-4">
            <p className="text-sm text-[--color-muted]">Available</p>
            <p className="mt-1 text-2xl font-bold text-green-600">{availableSlots}</p>
          </div>
          <div className="rounded-xl border border-[--color-border] p-4">
            <p className="text-sm text-[--color-muted]">Monthly Revenue Potential</p>
            <p className="mt-1 text-2xl font-bold text-[--color-primary]">
              ${totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      <AdSlotList adSlots={adSlots} />
    </div>
  );
}
