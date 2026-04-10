'use client';

import { useState } from 'react';

export default function CommentForm({ onSubmit }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    await onSubmit(content);
    setContent('');
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
      <input
        className="input flex-1"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
      />
      <button className="btn btn-primary" disabled={loading}>
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
}
