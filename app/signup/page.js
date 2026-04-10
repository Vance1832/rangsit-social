'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';

export default function SignupPage() {
  const router = useRouter();

  async function handleSignup(form) {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      router.push('/login');
    } else {
      throw new Error('Signup failed');
    }
  }

  return (
    <div className="space-y-6">
      <AuthForm type="signup" onSubmit={handleSignup} />
      <p className="text-center text-sm text-slate-500">
        Already have an account? <Link href="/login" className="link">Log in</Link>
      </p>
    </div>
  );
}
