import Link from 'next/link';
import { NavClient } from './nav-client';

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[--color-border] bg-[--color-background]/95 backdrop-blur-sm">
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-[--color-primary]">
          Anvara
        </Link>
        <NavClient />
      </nav>
    </header>
  );
}
