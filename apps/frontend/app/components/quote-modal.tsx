'use client';

import { useState } from 'react';
import { analytics } from '@/lib/analytics';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface QuoteModalProps {
  adSlotId: string;
  adSlotName: string;
  onClose: () => void;
}

export function QuoteModal({ adSlotId, adSlotName, onClose }: QuoteModalProps) {
  const [form, setForm] = useState({
    companyName: '',
    email: '',
    phone: '',
    budget: '',
    timeline: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.companyName.trim()) errors.companyName = 'Company name is required';
    if (!form.email.trim() || !EMAIL_REGEX.test(form.email.trim()))
      errors.email = 'Valid email is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL}/api/quotes/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          adSlotId,
          email: form.email.trim(),
          companyName: form.companyName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error || 'Failed to submit quote request');
        return;
      }

      setStatus('success');
      analytics.requestQuote(adSlotId);
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-slide-up w-full max-w-lg rounded-xl bg-[--color-background] p-6 shadow-xl">
        {status === 'success' ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Quote Request Submitted!</h3>
            <p className="text-sm text-[--color-muted]">
              We&apos;ll get back to you within 24 hours with a custom quote for &ldquo;{adSlotName}
              &rdquo;.
            </p>
            <button
              onClick={onClose}
              className="rounded-lg bg-[--color-primary] px-6 py-2 text-white hover:opacity-90"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Request a Quote</h3>
              <button
                onClick={onClose}
                className="text-[--color-muted] hover:text-[--color-foreground]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="mb-4 text-sm text-[--color-muted]">
              Get a custom quote for &ldquo;{adSlotName}&rdquo;. No commitment required.
            </p>

            {errorMsg && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="qCompany"
                    className="mb-1 block text-sm font-medium text-[--color-muted]"
                  >
                    Company Name *
                  </label>
                  <input
                    id="qCompany"
                    value={form.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
                  />
                  {fieldErrors.companyName && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.companyName}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="qEmail"
                    className="mb-1 block text-sm font-medium text-[--color-muted]"
                  >
                    Email *
                  </label>
                  <input
                    id="qEmail"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="qPhone"
                    className="mb-1 block text-sm font-medium text-[--color-muted]"
                  >
                    Phone (optional)
                  </label>
                  <input
                    id="qPhone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="qBudget"
                    className="mb-1 block text-sm font-medium text-[--color-muted]"
                  >
                    Budget Range
                  </label>
                  <select
                    id="qBudget"
                    value={form.budget}
                    onChange={(e) => updateField('budget', e.target.value)}
                    className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
                  >
                    <option value="">Select...</option>
                    <option value="< $1,000">&lt; $1,000/mo</option>
                    <option value="$1,000 - $5,000">$1,000 - $5,000/mo</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000/mo</option>
                    <option value="$10,000+">$10,000+/mo</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="qTimeline"
                  className="mb-1 block text-sm font-medium text-[--color-muted]"
                >
                  Timeline
                </label>
                <select
                  id="qTimeline"
                  value={form.timeline}
                  onChange={(e) => updateField('timeline', e.target.value)}
                  className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
                >
                  <option value="">Select...</option>
                  <option value="ASAP">ASAP</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="1 month">Within a month</option>
                  <option value="3+ months">3+ months</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="qMessage"
                  className="mb-1 block text-sm font-medium text-[--color-muted]"
                >
                  Tell us about your goals
                </label>
                <textarea
                  id="qMessage"
                  value={form.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  rows={3}
                  placeholder="What are you looking to achieve with this placement?"
                  className="w-full rounded-lg border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm placeholder:text-[--color-muted] focus:border-[--color-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex-1 rounded-lg bg-[--color-primary] py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {status === 'loading' ? 'Submitting...' : 'Submit Quote Request'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-[--color-border] px-4 py-2.5 text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
