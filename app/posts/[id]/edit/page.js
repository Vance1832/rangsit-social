'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';
import PostForm from '@/components/PostForm';
import Loading from '@/components/Loading';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      const res = await fetch(`/api/posts/${params.id}`);
      const data = await res.json();
      setPost(data.post);
      setLoading(false);
    }
    loadPost();
  }, [params.id]);

  if (loading) return <Loading label="Loading post..." />;
  if (!post) return <p className="text-sm text-slate-500">Post not found.</p>;

  async function handleSubmit(formData) {
    const res = await fetch(`/api/posts/${params.id}`, {
      method: 'PUT',
      body: formData
    });
    if (res.ok) {
      router.push(`/posts/${params.id}`);
    } else {
      throw new Error('Failed to update post');
    }
  }

  return (
    <RouteGuard requireProfile>
      <div className="space-y-6">
        <div className="glass-panel p-6 md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">Edit</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Refine your post</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Update the message, replace the media, or remove it entirely before publishing the revised version.
          </p>
        </div>
        <PostForm submitLabel="Update" onSubmit={handleSubmit} initial={post} />
      </div>
    </RouteGuard>
  );
}
