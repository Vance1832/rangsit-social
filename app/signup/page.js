'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';
import BrandLogo from '@/components/BrandLogo';
import { useAuth } from '@/components/Providers';

export default function SignupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;
    router.replace(user.profile_completed ? '/feed' : '/onboarding');
  }, [user, loading, router]);

  async function handleSignup(form) {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      throw new Error(data.message || 'Signup failed');
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-9rem)] gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)] lg:items-center xl:gap-8">
      <section className="glass-panel overflow-hidden p-0">
        <div className="bg-gradient-to-br from-slate-950 via-brand-900 to-sky-500 p-8 text-white md:p-12">
          <BrandLogo dark />
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.28em] text-sky-100">Get started</p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight md:text-5xl">
            Create your campus account and build your profile in minutes.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-sky-50/90 md:text-base">
            Sign up with your email first. After login, onboarding completes your public profile with your photo,
            username, bio, and birthday before you enter the feed.
          </p>
          <div className="mt-8 space-y-3">
            <div className="rounded-[24px] border border-white/15 bg-white/10 p-4 text-sm text-white/85">
              Step 1: Create your account
            </div>
            <div className="rounded-[24px] border border-white/15 bg-white/10 p-4 text-sm text-white/85">
              Step 2: Log in and complete onboarding
            </div>
            <div className="rounded-[24px] border border-white/15 bg-white/10 p-4 text-sm text-white/85">
              Step 3: Start posting and following people
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center">
        <AuthForm
          type="signup"
          onSubmit={handleSignup}
          footer={
            <p className="text-center text-sm text-slate-500">
              Already have an account? <Link href="/login" className="link font-medium">Log in</Link>
            </p>
          }
        />
      </div>
    </div>
  );
}
