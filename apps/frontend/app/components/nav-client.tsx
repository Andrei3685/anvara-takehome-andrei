'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authClient } from '@/auth-client';

type UserRole = 'sponsor' | 'publisher' | null;

async function fetchUserRole(userId: string): Promise<UserRole> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/auth/role/${userId}`
  );
  const data = await res.json();
  return data.role;
}

export function NavClient() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch user role via React Query instead of useEffect
  const { data: role = null } = useQuery<UserRole>({
    queryKey: ['userRole', user?.id],
    queryFn: () => fetchUserRole(user!.id),
    enabled: !!user?.id,
  });

  // Close mobile menu on navigation
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  }

  const isActive = (path: string) => pathname === path;

  const linkClass = (path: string) =>
    `transition-colors ${
      isActive(path)
        ? 'text-[--color-primary] font-medium'
        : 'text-[--color-muted] hover:text-[--color-foreground]'
    }`;

  return (
    <>
      {/* Desktop nav */}
      <div className="hidden items-center gap-6 md:flex">
        <Link href="/marketplace" className={linkClass('/marketplace')}>
          Marketplace
        </Link>

        {user && role === 'sponsor' && (
          <Link href="/dashboard/sponsor" className={linkClass('/dashboard/sponsor')}>
            My Campaigns
          </Link>
        )}
        {user && role === 'publisher' && (
          <Link href="/dashboard/publisher" className={linkClass('/dashboard/publisher')}>
            My Ad Slots
          </Link>
        )}

        {isPending ? (
          <span className="text-[--color-muted]">...</span>
        ) : user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-[--color-muted]">
              {user.name} {role && `(${role})`}
            </span>
            <button
              onClick={async () => {
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = '/';
                    },
                  },
                });
              }}
              className="rounded bg-gray-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-gray-500"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-lg bg-[--color-primary] px-4 py-2 text-sm text-white transition-colors hover:bg-[--color-primary-hover]"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[--color-border] md:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full border-t border-[--color-border] bg-[--color-background] p-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/marketplace"
              className={`rounded-lg px-3 py-2.5 text-sm font-medium ${isActive('/marketplace') ? 'bg-indigo-50 text-[--color-primary] dark:bg-indigo-900/20' : 'text-[--color-muted] hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              Marketplace
            </Link>

            {user && role === 'sponsor' && (
              <Link
                href="/dashboard/sponsor"
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${isActive('/dashboard/sponsor') ? 'bg-indigo-50 text-[--color-primary] dark:bg-indigo-900/20' : 'text-[--color-muted] hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                My Campaigns
              </Link>
            )}
            {user && role === 'publisher' && (
              <Link
                href="/dashboard/publisher"
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${isActive('/dashboard/publisher') ? 'bg-indigo-50 text-[--color-primary] dark:bg-indigo-900/20' : 'text-[--color-muted] hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                My Ad Slots
              </Link>
            )}

            {isPending ? null : user ? (
              <div className="border-t border-[--color-border] pt-3">
                <span className="mb-2 block px-3 text-sm text-[--color-muted]">
                  {user.name} {role && `(${role})`}
                </span>
                <button
                  onClick={async () => {
                    await authClient.signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          window.location.href = '/';
                        },
                      },
                    });
                  }}
                  className="w-full rounded-lg bg-gray-600 px-3 py-2.5 text-sm text-white hover:bg-gray-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-[--color-primary] px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-[--color-primary-hover]"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
