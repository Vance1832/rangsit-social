'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { formatDate } from '@/utils/format';
import CommentForm from './CommentForm';
import { useAuth } from './Providers';

function displayName(comment) {
  const full = [comment.first_name, comment.last_name].filter(Boolean).join(' ');
  return full || comment.username || 'User';
}

export default function CommentList({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadComments() {
    const res = await fetch(`/api/posts/${postId}/comments`);
    const data = await res.json();
    setComments(data.comments || []);
    setLoading(false);
  }

  useEffect(() => {
    loadComments();
  }, [postId]);

  async function handleAdd(content) {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    if (res.ok) {
      loadComments();
    }
  }

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Comments</h3>
        <span className="badge">{comments.length}</span>
      </div>

      {user ? (
        <CommentForm onSubmit={handleAdd} />
      ) : (
        <p className="text-sm text-slate-500 mt-3">Log in to join the conversation.</p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500 mt-4">Loading comments...</p>
      ) : comments.length ? (
        <div className="mt-5 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-3xl border border-slate-100 bg-white/70 p-4">
              <div className="flex items-center gap-3">
                {comment.user_avatar ? (
                  <Image
                    src={comment.user_avatar}
                    alt={displayName(comment)}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
                    {displayName(comment).slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-slate-950">{displayName(comment)}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{formatDate(comment.created_at)}</p>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 mt-4">No comments yet. Be the first!</p>
      )}
    </section>
  );
}
