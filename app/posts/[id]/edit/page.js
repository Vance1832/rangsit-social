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
        <div className="card p-6">
          <h1 className="text-2xl font-semibold">Edit post</h1>
          <p className="text-sm text-slate-500 mt-2">Polish your message before sharing again.</p>
        </div>
        <PostForm submitLabel="Update" onSubmit={handleSubmit} initial={post} />
      </div>
    </RouteGuard>
  );
}
