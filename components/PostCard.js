'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './Providers';
import { formatDate } from '@/utils/format';
import LikeButton from './LikeButton';

function displayName(post) {
  const full = [post.first_name, post.last_name].filter(Boolean).join(' ');
  return full || post.username || 'User';
}

export default function PostCard({ post, onDeleted, showActions = true }) {
  const { user } = useAuth();
  const router = useRouter();

  async function handleDelete() {
    const ok = confirm('Delete this post?');
    if (!ok) return;
    const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
    if (res.ok) {
      onDeleted?.(post.id);
      router.push('/feed');
    }
  }

  return (
    <article className="card p-6">
      <div className="flex items-center gap-3">
        {post.author_avatar ? (
          <Image
            src={post.author_avatar}
            alt={displayName(post)}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold">
            {displayName(post).slice(0, 1).toUpperCase()}
          </div>
        )}
        <div>
          <Link href={`/profile/${post.user_id}`} className="font-semibold hover:text-brand-600">
            {displayName(post)}
          </Link>
          <p className="text-xs text-slate-500">{formatDate(post.created_at)}</p>
        </div>
      </div>

      <p className="mt-4 text-slate-800 leading-relaxed whitespace-pre-line">{post.content}</p>

      {post.media_url && post.media_type === 'image' && (
        <Image
          src={post.media_url}
          alt="Post media"
          width={1200}
          height={900}
          className="mt-4 w-full max-h-96 object-cover rounded-2xl border"
        />
      )}

      {post.media_url && post.media_type === 'video' && (
        <video
          src={post.media_url}
          className="mt-4 w-full max-h-96 rounded-2xl border"
          controls
        />
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <LikeButton postId={post.id} initialLiked={!!post.liked} initialCount={post.like_count} />
          <Link href={`/posts/${post.id}`} className="hover:text-brand-600">
            {post.comment_count} comments
          </Link>
        </div>

        {showActions && user?.id === post.user_id && (
          <div className="flex items-center gap-3 text-sm">
            <Link href={`/posts/${post.id}/edit`} className="hover:text-brand-600">Edit</Link>
            <button onClick={handleDelete} className="text-rose-500 hover:text-rose-600">Delete</button>
          </div>
        )}
      </div>
    </article>
  );
}
