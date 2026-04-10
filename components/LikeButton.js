'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './Providers';

export default function LikeButton({ postId, initialLiked, initialCount }) {
  const { user } = useAuth();
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  async function toggleLike() {
    if (!user) {
      router.push('/login');
      return;
    }
    const res = await fetch(`/api/posts/${postId}/likes`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      const nextLiked = data.liked;
      setLiked(nextLiked);
      setCount((prev) => (nextLiked ? prev + 1 : prev - 1));
    }
  }

  return (
    <button onClick={toggleLike} className={`flex items-center gap-1 ${liked ? 'text-brand-600' : ''}`}>
      <span>{liked ? '❤️' : '🤍'}</span>
      <span>{count}</span>
    </button>
  );
}
