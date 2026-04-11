'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from './Providers';
import FollowButton from './FollowButton';
import { formatDateOnly } from '@/utils/format';

function displayName(user) {
  const full = [user.first_name, user.last_name].filter(Boolean).join(' ');
  return full || user.username || user.email;
}

export default function ProfileHeader({ user, stats }) {
  const { user: currentUser } = useAuth();
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="glass-panel overflow-hidden p-6">
      <div className="rounded-[28px] bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-6 text-white shadow-inner">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={displayName(user)}
                width={80}
                height={80}
                className="h-24 w-24 rounded-[28px] object-cover ring-2 ring-white/30"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-white/10 text-3xl font-semibold text-white">
                {displayName(user).slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">{displayName(user)}</h1>
              <p className="mt-1 text-sm font-medium text-slate-300">@{user.username || 'student'}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-cyan-200">
                Birthday {formatDateOnly(user.birthday)}
              </p>
            </div>
          </div>
          {isOwnProfile ? (
            <Link href="/profile/edit" className="btn btn-outline">
              Edit profile
            </Link>
          ) : (
            <FollowButton targetId={user.id} initialFollowing={stats.isFollowing} />
          )}
        </div>
      </div>
      <div className="grid gap-4 px-2 pt-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <p className="text-sm leading-7 text-slate-600">{user.bio || 'No bio yet.'}</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/profile/${user.id}/followers`} className="metric-link">
            <span className="text-slate-950">{stats.followers}</span>
            <span className="text-slate-500">Followers</span>
          </Link>
          <Link href={`/profile/${user.id}/following`} className="metric-link">
            <span className="text-slate-950">{stats.following}</span>
            <span className="text-slate-500">Following</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
