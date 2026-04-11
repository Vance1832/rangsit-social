'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import RouteGuard from '@/components/RouteGuard';
import UserListItem from '@/components/UserListItem';

export default function FollowingPage() {
  const params = useParams();
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [usersRes, profileRes] = await Promise.all([
        fetch(`/api/users/${params.id}/following`),
        fetch(`/api/users/${params.id}`)
      ]);

      const usersData = await usersRes.json();
      const profileData = await profileRes.json();

      setUsers(usersData.users || []);
      setProfile(profileData.user || null);
      setLoading(false);
    }

    loadData();
  }, [params.id]);

  if (loading) return <Loading label="Loading following..." />;

  return (
    <RouteGuard requireProfile>
      <div className="space-y-6">
        <div className="glass-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">Connections</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {profile?.first_name || profile?.username || 'User'} is following
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Profiles this user currently follows.
          </p>
          <Link href={`/profile/${params.id}`} className="link mt-4 inline-flex text-sm">
            Back to profile
          </Link>
        </div>

        {users.length ? (
          <div className="space-y-4">
            {users.map((user) => (
              <UserListItem key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <EmptyState title="Not following anyone yet" description="This user has not followed any profiles yet." />
        )}
      </div>
    </RouteGuard>
  );
}
