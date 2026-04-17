import Link from 'next/link';
import { headers } from 'next/headers';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { NavClient } from './nav-client';

export async function Nav() {
  // Fetch session server-side
  let user: { id: string; name: string; email: string } | null = null;
  let role: 'sponsor' | 'publisher' | null = null;

  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });
    if (session?.user) {
      user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      };
      const roleData = await getUserRole(session.user.id);
      role = roleData.role;
    }
  } catch {
    // Auth fetch failed — render nav without user info
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[--color-border] bg-[--color-background]/95 backdrop-blur-sm">
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-[--color-primary]">
          Anvara
        </Link>
        <NavClient user={user} role={role} />
      </nav>
    </header>
  );
}
