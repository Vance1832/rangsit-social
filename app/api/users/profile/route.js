import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { getUserFromRequest } from '@/utils/auth';
import { IMAGE_TYPES, saveUpload } from '@/utils/upload';

export async function PUT(req) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const formData = await req.formData();
    const firstName = (formData.get('firstName') || '').trim();
    const lastName = (formData.get('lastName') || '').trim();
    const username = (formData.get('username') || '').trim();
    const birthday = formData.get('birthday');
    const bio = (formData.get('bio') || '').trim();
    const avatarUrl = formData.get('avatarUrl');
    const avatarFile = formData.get('avatar');

    if (!firstName || !lastName || !username || !birthday) {
      return NextResponse.json({ message: 'First name, last name, username, and birthday are required.' }, { status: 400 });
    }

    if (bio.length > 255) {
      return NextResponse.json({ message: 'Bio must be 255 characters or fewer.' }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9._]{3,30}$/.test(username)) {
      return NextResponse.json({ message: 'Username must be 3-30 characters and use only letters, numbers, dots, or underscores.' }, { status: 400 });
    }

    const existing = await query('SELECT id FROM users WHERE username = ? AND id != ?', [username, user.id]);
    if (existing.length) {
      return NextResponse.json({ message: 'Username already taken.' }, { status: 409 });
    }

    let finalAvatarUrl = avatarUrl || user.avatar || '';

    if (!avatarUrl && avatarFile && typeof avatarFile !== 'string') {
      const upload = await saveUpload(avatarFile, IMAGE_TYPES, {
        folder: 'rangsit-social/profile-images',
        resourceType: 'image'
      });
      finalAvatarUrl = upload.url;
    }

    await query(
      `UPDATE users
       SET first_name = ?, last_name = ?, username = ?, birthday = ?, bio = ?, avatar = ?
       WHERE id = ?`,
      [firstName, lastName, username, birthday, bio, finalAvatarUrl, user.id]
    );

    return NextResponse.json({ message: 'Profile updated.' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update profile.' }, { status: 500 });
  }
}
