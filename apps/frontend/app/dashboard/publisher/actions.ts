'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

export interface ActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieString = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');
  return {
    'Content-Type': 'application/json',
    Cookie: cookieString,
  };
}

export async function createAdSlot(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const type = formData.get('type') as string;
  const basePrice = formData.get('basePrice') as string;

  const fieldErrors: Record<string, string> = {};
  if (!name?.trim()) fieldErrors.name = 'Name is required';
  if (!type) fieldErrors.type = 'Type is required';
  if (!basePrice || Number(basePrice) <= 0)
    fieldErrors.basePrice = 'Price must be a positive number';

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  try {
    const res = await fetch(`${API_URL}/api/ad-slots`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        name: name.trim(),
        description: description?.trim() || undefined,
        type,
        basePrice: Number(basePrice),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return { error: data?.error || 'Failed to create ad slot' };
    }

    revalidatePath('/dashboard/publisher');
    return { success: true };
  } catch {
    return { error: 'Failed to create ad slot' };
  }
}

export async function updateAdSlot(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const type = formData.get('type') as string;
  const basePrice = formData.get('basePrice') as string;
  const isAvailable = formData.get('isAvailable') as string;

  const fieldErrors: Record<string, string> = {};
  if (!name?.trim()) fieldErrors.name = 'Name is required';
  if (!type) fieldErrors.type = 'Type is required';
  if (!basePrice || Number(basePrice) <= 0)
    fieldErrors.basePrice = 'Price must be a positive number';

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  try {
    const res = await fetch(`${API_URL}/api/ad-slots/${id}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        name: name.trim(),
        description: description?.trim() || undefined,
        type,
        basePrice: Number(basePrice),
        isAvailable: isAvailable === 'true',
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return { error: data?.error || 'Failed to update ad slot' };
    }

    revalidatePath('/dashboard/publisher');
    return { success: true };
  } catch {
    return { error: 'Failed to update ad slot' };
  }
}

export async function deleteAdSlot(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;

  try {
    const res = await fetch(`${API_URL}/api/ad-slots/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    });

    if (!res.ok && res.status !== 204) {
      const data = await res.json().catch(() => null);
      return { error: data?.error || 'Failed to delete ad slot' };
    }

    revalidatePath('/dashboard/publisher');
    return { success: true };
  } catch {
    return { error: 'Failed to delete ad slot' };
  }
}
