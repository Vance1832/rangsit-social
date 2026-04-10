export async function uploadProfileImage(file) {
  const payload = new FormData();
  payload.append('file', file);

  const res = await fetch('/api/upload/profile', {
    method: 'POST',
    body: payload
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to upload profile image.');
  }

  return data;
}

export async function uploadPostMedia(file) {
  const payload = new FormData();
  payload.append('file', file);

  const res = await fetch('/api/upload/post', {
    method: 'POST',
    body: payload
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to upload post media.');
  }

  return data;
}
