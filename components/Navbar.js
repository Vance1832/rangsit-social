'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  const pathname = usePathname();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-30 border-b border-brand-900/15 bg-gradient-to-r from-brand-900 via-brand-800 to-sky-600 shadow-[0_8px_30px_rgba(0,92,153,0.22)]">
      <div className="container flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4">
          <BrandLogo dark />
          <div className="hidden rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80 md:inline-flex">
            Campus Social
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-3">
          <Link
            href="/feed"
            className={pathname === '/feed' ? 'nav-pill-active' : 'nav-pill'}
          >
            Feed
          </Link>
          {user && user.profile_completed && (
            <Link href="/posts/new" className={pathname === '/posts/new' ? 'nav-pill-active' : 'nav-pill'}>
              New Post
            </Link>
          )}
          {!loading && !user && (
            <div className="flex items-center gap-2">
              <Link href="/login" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/16">Log in</Link>
              <Link href="/signup" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-800 transition hover:bg-slate-100">Sign up</Link>
            </div>
          )}
          {!loading && user && (
            <div className="flex items-center gap-3">
              <Link
                href={user.profile_completed ? `/profile/${user.id}` : '/onboarding'}
                className="flex items-center gap-3 rounded-full border border-white/18 bg-white/10 px-2 py-1 pr-4 backdrop-blur"
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={displayName(user)}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full border border-white/30 object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">
                    {displayName(user).slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{displayName(user)}</p>
                  <p className="truncate text-xs text-white/70">
                    {user.profile_completed ? `@${user.username || 'student'}` : 'Finish profile'}
                  </p>
                </div>
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-white/78 hover:text-white">
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
