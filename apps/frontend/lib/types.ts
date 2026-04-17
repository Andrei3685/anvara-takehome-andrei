// Core types matching the Prisma schema

export type UserRole = 'sponsor' | 'publisher';

export type CampaignStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CANCELLED';

export type AdSlotType = 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST';

export type PlacementStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'ACTIVE'
  | 'PAUSED'
  | 'COMPLETED'
  | 'REJECTED';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  budget: number;
  spent: number;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  targetCategories?: string[];
  targetRegions?: string[];
  sponsorId: string;
  sponsor?: { id: string; name: string };
}

export interface AdSlot {
  id: string;
  name: string;
  description?: string;
  type: AdSlotType;
  position?: string;
  width?: number;
  height?: number;
  basePrice: number;
  cpmFloor?: number;
  isAvailable: boolean;
  publisherId: string;
  publisher?: { id: string; name: string };
}

export interface Placement {
  id: string;
  impressions: number;
  clicks: number;
  conversions: number;
  status: PlacementStatus;
  campaignId: string;
  adSlotId: string;
  publisherId: string;
}
