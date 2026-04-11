'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProfileHeader from '@/components/ProfileHeader';
import PostCard from '@/components/PostCard';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import RouteGuard from '@/components/RouteGuard';

export default function ProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ followers: 0, following: 0, isFollowing: false });
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    const res = await fetch(`/api/users/${params.id}`);
    const data = await res.json();
    setProfile(data.user);
    setPosts(data.posts || []);
    setStats(data.stats || { followers: 0, following: 0, isFollowing: false });
    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, [params.id]);

  if (loading) return <Loading label="Loading profile..." />;
  if (!profile) return <p className="text-sm text-slate-500">User not found.</p>;

  return (
    <RouteGuard requireProfile>
      <div className="space-y-8">
        <ProfileHeader user={profile} stats={stats} />
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Posts</h2>
            <p className="text-sm text-slate-400">{posts.length} shared</p>
          </div>
        </section>
        <div className="space-y-7">
          {posts.length ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <EmptyState title="No posts yet" description="This user hasn't posted anything yet." />
          )}
        </div>
      </div>
    </RouteGuard>
  );
}
