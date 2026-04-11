'use client';

import { useEffect, useState } from 'react';
import PostCard from './PostCard';
import Loading from './Loading';
import EmptyState from './EmptyState';
import Link from 'next/link';

export default function FeedList({
  endpoint,
  filterUserId,
  emptyTitle = 'No posts yet',
  emptyDescription = 'Be the first to share something with your community.'
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const resolvedEndpoint = endpoint || (filterUserId ? `/api/users/${filterUserId}` : '/api/posts');

  async function loadPosts(nextPage = 1, append = false) {
    const res = await fetch(`${resolvedEndpoint}?page=${nextPage}&limit=5`);
    const data = await res.json();
    setPosts((prev) => (append ? [...prev, ...(data.posts || [])] : (data.posts || [])));
    setHasMore(!!data.pagination?.hasMore);
    setPage(nextPage);
    setLoading(false);
    setLoadingMore(false);
  }

  useEffect(() => {
    setLoading(true);
    loadPosts(1, false);
  }, [resolvedEndpoint]);

  function handleDeleted(id) {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  }

  async function handleLoadMore() {
    setLoadingMore(true);
    await loadPosts(page + 1, true);
  }

  if (loading) return <Loading label="Loading posts..." />;

  if (!posts.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={<Link href="/posts/new" className="btn btn-primary">Create post</Link>}
      />
    );
  }

  return (
    <div className="space-y-7">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onDeleted={handleDeleted} />
      ))}
      {hasMore ? (
        <div className="flex justify-center pt-2">
          <button onClick={handleLoadMore} disabled={loadingMore} className="btn btn-outline">
            {loadingMore ? 'Loading...' : 'Load more'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
