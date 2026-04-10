'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';
import { useAuth } from '@/components/Providers';
import { uploadProfileImage } from '@/utils/upload-client';

export default function OnboardingPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    birthday: '',
    bio: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const uploadedAvatar = await uploadProfileImage(avatarFile);
      const payload = new FormData();
      payload.append('firstName', form.firstName);
      payload.append('lastName', form.lastName);
      payload.append('username', form.username);
      payload.append('birthday', form.birthday);
      payload.append('bio', form.bio);
      payload.append('avatarUrl', uploadedAvatar.url);

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        body: payload
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to complete onboarding.');
      }

      await refresh();
      router.push('/feed');
    } catch (err) {
      setError(err.message || 'Failed to complete onboarding.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <RouteGuard onboardingOnly>
      <div className="space-y-6">
        <div className="card p-6">
          <h1 className="text-2xl font-semibold">Complete your profile</h1>
          <p className="text-sm text-slate-500 mt-2">
            Tell your campus community who you are.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">First name</label>
              <input
                className="input mt-2"
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last name</label>
              <input
                className="input mt-2"
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              className="input mt-2"
              value={form.username}
              onChange={(e) => updateField('username', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Birthday</label>
            <input
              className="input mt-2"
              type="date"
              value={form.birthday}
              onChange={(e) => updateField('birthday', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Bio</label>
            <textarea
              className="textarea mt-2"
              value={form.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="Share a short intro..."
            />
          </div>

          <div>
            <label className="text-sm font-medium">Profile photo</label>
            <input
              className="input mt-2"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Profile preview"
                className="mt-3 h-24 w-24 rounded-2xl object-cover border"
              />
            )}
          </div>

          {error && <p className="text-sm text-rose-500">{error}</p>}

          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Finish setup'}
          </button>
        </form>
      </div>
    </RouteGuard>
  );
}
