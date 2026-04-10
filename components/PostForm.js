'use client';

import { useEffect, useState } from 'react';
import { uploadPostMedia } from '@/utils/upload-client';

export default function PostForm({ initial = { content: '', media_url: null, media_type: null }, onSubmit, submitLabel }) {
  const [content, setContent] = useState(initial.content || '');
  const [mediaFile, setMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initial.media_url || '');
  const [previewType, setPreviewType] = useState(initial.media_type || null);
  const [removeMedia, setRemoveMedia] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(file);
    setMediaFile(file);
    setPreviewUrl(url);
    setPreviewType(file.type.startsWith('video/') ? 'video' : 'image');
    setRemoveMedia(false);
  }

  function handleRemoveMedia() {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setMediaFile(null);
    setPreviewUrl('');
    setPreviewType(null);
    setRemoveMedia(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = new FormData();
      payload.append('content', content);
      if (removeMedia) payload.append('removeMedia', 'true');

      if (mediaFile) {
        const uploadedMedia = await uploadPostMedia(mediaFile);
        payload.append('mediaUrl', uploadedMedia.url);
        payload.append('mediaType', uploadedMedia.mediaType);
      }

      await onSubmit(payload);
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4">
      <div>
        <label className="text-sm font-medium">Post content</label>
        <textarea
          className="textarea mt-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share something with your campus..."
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Media (optional)</label>
        <input
          className="input mt-2"
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
        {previewUrl && (
          <div className="mt-3 space-y-2">
            {previewType === 'video' ? (
              <video src={previewUrl} className="w-full max-h-96 rounded-2xl border" controls />
            ) : (
              <img src={previewUrl} alt="Preview" className="w-full max-h-96 object-cover rounded-2xl border" />
            )}
            <button type="button" onClick={handleRemoveMedia} className="text-sm text-rose-500">
              Remove media
            </button>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-rose-500">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
