'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BrandLogo from './BrandLogo';
import { useAuth } from './Providers';

function displayName(user) {
  if (!user) return '';
  const full = [user.first_name, user.last_name].filter(Boolean).join(' ');
  return full || user.username || user.email;
}

export default function Navbar() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-white/60 backdrop-blur-2xl">
      <div className="container flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4">
          <BrandLogo />
          <div className="hidden rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700 md:inline-flex">
            Campus Social
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-3">
          <Link
            href="/feed"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/80 hover:text-indigo-700"
          >
            Feed
          </Link>
          {user && user.profile_completed && (
            <Link href="/posts/new" className="btn btn-primary">
              New Post
            </Link>
          )}
          {!loading && !user && (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn btn-outline">Log in</Link>
              <Link href="/signup" className="btn btn-primary">Sign up</Link>
            </div>
          )}
          {!loading && user && (
            <div className="flex items-center gap-3">
              <Link
                href={user.profile_completed ? `/profile/${user.id}` : '/onboarding'}
                className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-2 py-1 pr-4 shadow-sm backdrop-blur"
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={displayName(user)}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover border"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold">
                    {displayName(user).slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{displayName(user)}</p>
                  <p className="truncate text-xs text-slate-500">
                    {user.profile_completed ? `@${user.username || 'student'}` : 'Finish profile'}
                  </p>
                </div>
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-indigo-700">
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
