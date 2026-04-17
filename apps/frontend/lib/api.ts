// Simple API client with cookie-based auth

import type { Campaign, AdSlot, Placement } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

interface ApiError {
  error: string;
}

export async function api<T>(endpoint: string, options?: Parameters<typeof fetch>[1]): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    credentials: 'include',
    ...options,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(body?.error || 'API request failed');
  }
  return res.json();
}

// Campaigns
export const getCampaigns = (sponsorId?: string) =>
  api<Campaign[]>(sponsorId ? `/api/campaigns?sponsorId=${sponsorId}` : '/api/campaigns');
export const getCampaign = (id: string) => api<Campaign>(`/api/campaigns/${id}`);
export const createCampaign = (data: Partial<Campaign>) =>
  api<Campaign>('/api/campaigns', { method: 'POST', body: JSON.stringify(data) });
export const updateCampaign = (id: string, data: Partial<Campaign>) =>
  api<Campaign>(`/api/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCampaign = (id: string) =>
  api<void>(`/api/campaigns/${id}`, { method: 'DELETE' });

// Ad Slots
export const getAdSlots = (publisherId?: string) =>
  api<AdSlot[]>(publisherId ? `/api/ad-slots?publisherId=${publisherId}` : '/api/ad-slots');
export const getAdSlot = (id: string) => api<AdSlot>(`/api/ad-slots/${id}`);
export const createAdSlot = (data: Partial<AdSlot>) =>
  api<AdSlot>('/api/ad-slots', { method: 'POST', body: JSON.stringify(data) });
export const updateAdSlot = (id: string, data: Partial<AdSlot>) =>
  api<AdSlot>(`/api/ad-slots/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAdSlot = (id: string) => api<void>(`/api/ad-slots/${id}`, { method: 'DELETE' });

// Placements
export const getPlacements = () => api<Placement[]>('/api/placements');
export const createPlacement = (data: Partial<Placement>) =>
  api<Placement>('/api/placements', { method: 'POST', body: JSON.stringify(data) });

// Dashboard
interface DashboardStats {
  sponsors: number;
  publishers: number;
  activeCampaigns: number;
  totalPlacements: number;
  metrics: {
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    avgCtr: number | string;
  };
}
export const getStats = () => api<DashboardStats>('/api/dashboard/stats');
