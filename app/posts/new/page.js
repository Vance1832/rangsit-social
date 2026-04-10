'use client';

import { useRouter } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';
import PostForm from '@/components/PostForm';

export default function NewPostPage() {
  const router = useRouter();

  async function handleSubmit(formData) {
    const res = await fetch('/api/posts', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      router.push('/feed');
    } else {
      throw new Error('Failed to create post');
    }
  }

  return (
    <RouteGuard requireProfile>
      <div className="space-y-6">
        <div className="card p-6">
          <h1 className="text-2xl font-semibold">Create a post</h1>
          <p className="text-sm text-slate-500 mt-2">Share a moment with your campus.</p>
        </div>
        <PostForm submitLabel="Publish" onSubmit={handleSubmit} />
      </div>
    </RouteGuard>
  );
}
