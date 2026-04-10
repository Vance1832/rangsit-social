'use client';

import { useEffect, useState } from 'react';
import PostCard from './PostCard';
import Loading from './Loading';
import EmptyState from './EmptyState';
import Link from 'next/link';

export default function FeedList({ filterUserId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadPosts() {
    const res = await fetch(filterUserId ? `/api/users/${filterUserId}` : '/api/posts');
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, [filterUserId]);

  function handleDeleted(id) {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  }

  if (loading) return <Loading label="Loading posts..." />;

  if (!posts.length) {
    return (
      <EmptyState
        title="No posts yet"
        description="Be the first to share something with your community."
        action={<Link href="/posts/new" className="btn btn-primary">Create post</Link>}
      />
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onDeleted={handleDeleted} />
      ))}
    </div>
  );
}
