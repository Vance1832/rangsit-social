'use client';

import Image from 'next/image';
import Link from 'next/link';
import FollowButton from './FollowButton';

function displayName(user) {
  const full = [user.first_name, user.last_name].filter(Boolean).join(' ');
  return full || user.username || user.email || 'User';
}

export default function UserListItem({ user }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm shadow-slate-200/60 backdrop-blur">
      <Link href={`/profile/${user.id}`} className="flex min-w-0 items-center gap-4">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={displayName(user)}
            width={56}
            height={56}
            className="h-14 w-14 rounded-2xl object-cover ring-1 ring-slate-200"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-cyan-100 text-lg font-semibold text-indigo-700">
            {displayName(user).slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">{displayName(user)}</p>
          <p className="truncate text-sm text-slate-500">@{user.username || 'student'}</p>
          {user.bio ? <p className="mt-1 truncate text-xs text-slate-400">{user.bio}</p> : null}
        </div>
      </Link>
      <FollowButton targetId={user.id} initialFollowing={!!user.isFollowing} />
    </div>
  );
}
