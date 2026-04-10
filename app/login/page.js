'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/components/Providers';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  async function handleLogin(form) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password })
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      if (data.user.profile_completed) {
        router.push('/feed');
      } else {
        router.push('/onboarding');
      }
    } else {
      throw new Error('Login failed');
    }
  }

  return (
    <div className="space-y-6">
      <AuthForm type="login" onSubmit={handleLogin} />
      <p className="text-center text-sm text-slate-500">
        New here? <Link href="/signup" className="link">Create an account</Link>
      </p>
    </div>
  );
}
