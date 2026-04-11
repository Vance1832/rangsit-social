'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from './Providers';

function displayName(user) {
  const full = [user?.first_name, user?.last_name].filter(Boolean).join(' ');
  return full || user?.username || user?.email || 'Student';
}

export default function LeftSidebar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-5">
      <section className="sidebar-card">
        <Link href={user.profile_completed ? `/profile/${user.id}` : '/onboarding'} className="flex items-center gap-4">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={displayName(user)}
              width={56}
              height={56}
              className="h-14 w-14 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-lg font-semibold text-brand-700">
              {displayName(user).slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">{displayName(user)}</p>
            <p className="truncate text-xs text-slate-500">
              {user.profile_completed ? `@${user.username || 'student'}` : 'Finish profile'}
            </p>
          </div>
        </Link>
      </section>

      <section className="sidebar-card">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Shortcuts</h2>
        <div className="mt-4 flex flex-col gap-2">
          <Link href="/feed" className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
            Feed
          </Link>
          <Link href="/posts/new" className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
            Create post
          </Link>
          <Link href={`/profile/${user.id}`} className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
            My profile
          </Link>
          {!user.profile_completed ? (
            <Link href="/onboarding" className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
              Complete onboarding
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}
