'use client';

import Image from 'next/image';
import FollowButton from './FollowButton';
import { formatDateOnly } from '@/utils/format';

function displayName(user) {
  const full = [user.first_name, user.last_name].filter(Boolean).join(' ');
  return full || user.username || user.email;
}

export default function ProfileHeader({ user, stats }) {
  return (
    <div className="card p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={displayName(user)}
              width={80}
              height={80}
              className="h-20 w-20 rounded-2xl object-cover border"
            />
          ) : (
            <div className="h-20 w-20 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center text-2xl font-semibold">
              {displayName(user).slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold">{displayName(user)}</h1>
            <p className="text-sm text-slate-500">@{user.username || 'student'}</p>
            <p className="text-xs text-slate-400 mt-1">Birthday: {formatDateOnly(user.birthday)}</p>
          </div>
        </div>
        <FollowButton targetId={user.id} initialFollowing={stats.isFollowing} />
      </div>
      <p className="mt-4 text-slate-700">{user.bio || 'No bio yet.'}</p>
      <div className="mt-4 flex items-center gap-6 text-sm text-slate-500">
        <span><strong className="text-slate-800">{stats.followers}</strong> followers</span>
        <span><strong className="text-slate-800">{stats.following}</strong> following</span>
      </div>
    </div>
  );
}
