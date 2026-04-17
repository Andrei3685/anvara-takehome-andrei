import type { Metadata } from 'next';
import Link from 'next/link';
import { NewsletterForm } from './components/newsletter-form';

export const metadata: Metadata = {
  title: 'Anvara — The Sponsorship Marketplace',
  description:
    'Connect with premium publishers and sponsors. Anvara is the modern marketplace for digital sponsorships.',
};

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/20 dark:via-[--color-background] dark:to-purple-950/20" />
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
          The modern sponsorship marketplace
        </div>
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Connect sponsors with
          <span className="bg-gradient-to-r from-[--color-primary] to-purple-600 bg-clip-text text-transparent">
            {' '}
            premium publishers
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-[--color-muted] sm:text-xl">
          Anvara makes it easy to discover, book, and manage sponsorship placements. Whether
          you&apos;re a brand looking for reach or a publisher monetizing your audience.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/marketplace"
            className="group w-full rounded-xl bg-[--color-primary] px-8 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-[--color-primary-hover] hover:shadow-xl sm:w-auto"
          >
            Browse Marketplace
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            href="/login"
            className="w-full rounded-xl border border-[--color-border] px-8 py-3.5 font-semibold transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 sm:w-auto"
          >
            Get Started Free
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-[--color-muted]">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-500"
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
            No setup fees
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-500"
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
            Verified publishers
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <svg
              className="h-5 w-5 text-green-500"
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
            Real-time analytics
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      ),
      title: 'Discover Premium Inventory',
      description:
        'Browse curated ad slots across newsletters, podcasts, display ads, and video placements from verified publishers.',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
      ),
      title: 'Campaign Management',
      description:
        'Create and manage campaigns with budgets, targeting, and real-time performance tracking all in one dashboard.',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
          />
        </svg>
      ),
      title: 'Transparent Pricing',
      description:
        'See upfront pricing for every ad slot. No hidden fees, no surprises. Request custom quotes for enterprise needs.',
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      ),
      title: 'Verified & Secure',
      description:
        'Every publisher is vetted. Every transaction is tracked. Built-in analytics ensure your campaigns deliver results.',
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Everything you need to grow</h2>
        <p className="mx-auto max-w-2xl text-lg text-[--color-muted]">
          Anvara provides the tools for both sides of the marketplace to succeed.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-xl border border-[--color-border] p-6 transition-all hover:border-[--color-primary]/30 hover:shadow-lg"
          >
            <div className={`mb-4 inline-flex rounded-lg p-2.5 ${feature.color}`}>
              {feature.icon}
            </div>
            <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
            <p className="text-[--color-muted]">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Browse the Marketplace',
      description:
        'Explore ad slots from verified publishers. Filter by type, price, and audience to find the perfect fit.',
    },
    {
      step: '02',
      title: 'Book or Request a Quote',
      description:
        'Book instantly at listed prices, or request a custom quote for tailored packages and enterprise deals.',
    },
    {
      step: '03',
      title: 'Launch & Track',
      description:
        'Go live with your sponsorship and track impressions, clicks, and conversions in real-time.',
    },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">How it works</h2>
        <p className="mx-auto max-w-2xl text-lg text-[--color-muted]">
          Get your sponsorship live in three simple steps.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-3">
        {steps.map((item, i) => (
          <div key={item.step} className="relative text-center">
            {i < steps.length - 1 && (
              <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-gradient-to-r from-[--color-primary]/20 to-[--color-primary]/20 sm:block" />
            )}
            <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[--color-primary] text-xl font-bold text-white shadow-lg shadow-indigo-500/25">
              {item.step}
            </div>
            <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
            <p className="text-[--color-muted]">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="rounded-2xl bg-gradient-to-r from-[--color-primary] to-purple-600 px-8 py-12 text-white sm:py-16">
      <div className="grid gap-8 text-center sm:grid-cols-4">
        <div>
          <div className="text-3xl font-bold sm:text-4xl">500+</div>
          <div className="mt-1 text-indigo-200">Active Publishers</div>
        </div>
        <div>
          <div className="text-3xl font-bold sm:text-4xl">2,000+</div>
          <div className="mt-1 text-indigo-200">Ad Slots Listed</div>
        </div>
        <div>
          <div className="text-3xl font-bold sm:text-4xl">$2.4M</div>
          <div className="mt-1 text-indigo-200">Sponsorships Booked</div>
        </div>
        <div>
          <div className="text-3xl font-bold sm:text-4xl">98%</div>
          <div className="mt-1 text-indigo-200">Satisfaction Rate</div>
        </div>
      </div>
    </section>
  );
}

function ForPublishersSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="grid items-center gap-12 sm:grid-cols-2">
        <div>
          <div className="mb-4 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            For Publishers
          </div>
          <h2 className="mb-4 text-3xl font-bold">Monetize your audience</h2>
          <p className="mb-6 text-lg text-[--color-muted]">
            List your ad inventory, set your own prices, and let sponsors come to you. Anvara
            handles discovery and payments so you can focus on content.
          </p>
          <ul className="space-y-3 text-[--color-muted]">
            <li className="flex items-center gap-3">
              <svg
                className="h-5 w-5 shrink-0 text-[--color-secondary]"
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
              List display, video, newsletter, and podcast slots
            </li>
            <li className="flex items-center gap-3">
              <svg
                className="h-5 w-5 shrink-0 text-[--color-secondary]"
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
              Set your own pricing and availability
            </li>
            <li className="flex items-center gap-3">
              <svg
                className="h-5 w-5 shrink-0 text-[--color-secondary]"
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
              Track performance and manage placements
            </li>
          </ul>
        </div>
        <div className="rounded-xl border border-[--color-border] bg-gradient-to-br from-emerald-50 to-teal-50 p-8 dark:from-emerald-950/20 dark:to-teal-950/20">
          <div className="space-y-3">
            {['Newsletter Sponsorship', 'Podcast Pre-roll', 'Display Banner'].map((name, i) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-lg bg-white/80 p-3 shadow-sm dark:bg-gray-800/80"
              >
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-xs text-[--color-muted]">
                    {['NEWSLETTER', 'PODCAST', 'DISPLAY'][i]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[--color-secondary]">
                    ${[2500, 1800, 500][i]}/mo
                  </p>
                  <p className="text-xs text-green-600">● Available</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-16 text-center sm:py-20">
      <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to get started?</h2>
      <p className="mx-auto mb-8 max-w-xl text-lg text-[--color-muted]">
        Join hundreds of sponsors and publishers already using Anvara to power their sponsorship
        partnerships.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          href="/login"
          className="w-full rounded-xl bg-[--color-primary] px-8 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-[--color-primary-hover] hover:shadow-xl sm:w-auto"
        >
          Create Free Account
        </Link>
        <Link
          href="/marketplace"
          className="w-full rounded-xl border border-[--color-border] px-8 py-3.5 font-semibold transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 sm:w-auto"
        >
          Explore Marketplace
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <article className="-mx-4 -mt-4 sm:-mx-6 sm:-mt-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <HowItWorksSection />
        <ForPublishersSection />
        <div className="mx-auto max-w-xl py-8">
          <NewsletterForm />
        </div>
        <CTASection />
      </div>
    </article>
  );
}
