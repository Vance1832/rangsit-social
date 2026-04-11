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
        <div className="glass-panel p-6 md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">Create</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Share something worth seeing</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Post an update, event, or idea to the campus feed. Add one image or video when the story needs it.
          </p>
        </div>
        <PostForm submitLabel="Publish" onSubmit={handleSubmit} />
      </div>
    </RouteGuard>
  );
}
