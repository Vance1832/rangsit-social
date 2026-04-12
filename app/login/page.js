'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';
import BrandLogo from '@/components/BrandLogo';
import { useAuth } from '@/components/Providers';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, setUser, refresh } = useAuth();

  useEffect(() => {
    if (loading || !user) return;

    if (user.profile_completed) {
      const nextPath = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('next')
        : null;
      router.replace(nextPath || '/feed');
    } else {
      router.replace('/onboarding');
    }
  }, [user, loading, router]);

  async function handleLogin(form) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: form.email, password: form.password })
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      await refresh();
      const nextPath = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('next')
        : null;
      const destination = data.user.profile_completed ? (nextPath || '/feed') : '/onboarding';

      if (typeof window !== 'undefined') {
        window.location.replace(destination);
        return;
      }

      if (data.user.profile_completed) {
        router.replace(nextPath || '/feed');
      } else {
        router.replace('/onboarding');
      }
      router.refresh();
    } else {
      const data = await res.json();
      throw new Error(data.message || 'Login failed');
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-9rem)] gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)] lg:items-center xl:gap-8">
      <section className="glass-panel overflow-hidden p-0">
        <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-sky-500 p-8 text-white md:p-12">
          <BrandLogo dark />
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.28em] text-sky-100">Modern campus network</p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight md:text-5xl">
            Connect with campus life in one branded social space.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-sky-50/90 md:text-base">
            Follow classmates, share updates, join conversations, and keep your student presence active with a
            product-style experience built for Rangsit University.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/15 bg-white/10 p-4">
              <p className="text-sm font-semibold">Campus feed</p>
              <p className="mt-2 text-xs leading-6 text-white/75">Posts, photos, videos, and updates in one stream.</p>
            </div>
            <div className="rounded-[24px] border border-white/15 bg-white/10 p-4">
              <p className="text-sm font-semibold">Profiles</p>
              <p className="mt-2 text-xs leading-6 text-white/75">Real names, usernames, birthdays, and social stats.</p>
            </div>
            <div className="rounded-[24px] border border-white/15 bg-white/10 p-4">
              <p className="text-sm font-semibold">Connections</p>
              <p className="mt-2 text-xs leading-6 text-white/75">Follow people, explore lists, and stay visible.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center">
        <AuthForm
          type="login"
          onSubmit={handleLogin}
          footer={
            <p className="text-center text-sm text-slate-500">
              New here? <Link href="/signup" className="link font-medium">Create an account</Link>
            </p>
          }
        />
      </div>
    </div>
  );
}
