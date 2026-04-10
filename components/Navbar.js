'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold">
            RS
          </div>
          <div>
            <p className="text-lg font-semibold">Rangsit Social</p>
            <p className="text-xs text-slate-500">Connect your campus life</p>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/feed" className="text-sm font-medium text-slate-600 hover:text-brand-600">Feed</Link>
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
              <Link href={user.profile_completed ? `/profile/${user.id}` : '/onboarding'} className="flex items-center gap-2">
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
                <span className="text-sm font-medium">{displayName(user)}</span>
              </Link>
              <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-brand-600">Logout</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
