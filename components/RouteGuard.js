'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './Providers';
import Loading from './Loading';

export default function RouteGuard({ children, requireProfile = false, onboardingOnly = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (onboardingOnly && user.profile_completed) {
      router.replace('/feed');
      return;
    }
    if (requireProfile && !user.profile_completed) {
      router.replace('/onboarding');
    }
  }, [user, loading, onboardingOnly, requireProfile, router]);

  if (loading) return <Loading label="Checking session..." />;
  if (!user) return null;
  if (onboardingOnly && user.profile_completed) return null;
  if (requireProfile && !user.profile_completed) return null;

  return children;
}
