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
    <form onSubmit={handleSubmit} className="glass-panel space-y-6 p-6 md:p-7">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Post content</label>
          <span className="text-xs text-slate-400">{content.length}/5000</span>
        </div>
        <textarea
          className="textarea mt-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What is happening around campus today?"
          required
        />
      </div>

      <div className="rounded-[28px] border border-dashed border-slate-300/80 bg-slate-50/80 p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <label className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Media upload</label>
            <p className="mt-1 text-sm text-slate-500">
              Add one image or video. This keeps the composer simple and reliable for the demo.
            </p>
          </div>
          <span className="badge">Image or video</span>
        </div>
        <input
          className="input mt-4"
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
        {previewUrl && (
          <div className="mt-4 space-y-3">
            {previewType === 'video' ? (
              <video
                src={previewUrl}
                className="w-full max-h-96 rounded-[24px] border border-slate-200 bg-slate-950"
                controls
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-96 rounded-[24px] border border-slate-200 object-cover"
              />
            )}
            <button type="button" onClick={handleRemoveMedia} className="text-sm font-medium text-rose-500">
              Remove media
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}
      <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-2">
        <p className="text-xs text-slate-400">
          Your post will appear in the campus feed as soon as it is published.
        </p>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
