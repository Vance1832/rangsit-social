'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PostCard from '@/components/PostCard';
import CommentList from '@/components/CommentList';
import Loading from '@/components/Loading';
import RouteGuard from '@/components/RouteGuard';

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadPost() {
    const res = await fetch(`/api/posts/${params.id}`);
    const data = await res.json();
    setPost(data.post);
    setLoading(false);
  }

  useEffect(() => {
    loadPost();
  }, [params.id]);

  if (loading) return <Loading label="Loading post..." />;
  if (!post) return <p className="text-sm text-slate-500">Post not found.</p>;

  return (
    <RouteGuard requireProfile>
      <div className="space-y-6">
        <div className="glass-panel p-6">
          <Link href="/feed" className="link inline-flex text-sm">
            Back to feed
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Post detail</h1>
          <p className="mt-2 text-sm text-slate-500">
            View the full conversation, media, and engagement around this post.
          </p>
        </div>
        <PostCard post={post} showActions />
        <CommentList postId={post.id} />
      </div>
    </RouteGuard>
  );
}
