import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { getUserFromRequest } from '@/utils/auth';
import { IMAGE_TYPES, saveUpload } from '@/utils/upload';

export async function POST(req) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const formData = await req.formData();
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const username = formData.get('username');
    const birthday = formData.get('birthday');
    const bio = formData.get('bio') || '';
    const avatarUrl = formData.get('avatarUrl');
    const avatarFile = formData.get('avatar');

    if (!firstName || !lastName || !username || !birthday) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    if (!avatarUrl && (!avatarFile || typeof avatarFile === 'string')) {
      return NextResponse.json({ message: 'Profile image is required.' }, { status: 400 });
    }

    const existing = await query('SELECT id FROM users WHERE username = ? AND id != ?', [
      username,
      user.id
    ]);
    if (existing.length) {
      return NextResponse.json({ message: 'Username already taken.' }, { status: 409 });
    }

    let finalAvatarUrl = avatarUrl;

    if (!finalAvatarUrl && avatarFile && typeof avatarFile !== 'string') {
      const upload = await saveUpload(avatarFile, IMAGE_TYPES, {
        folder: 'rangsit-social/profile-images',
        resourceType: 'image'
      });
      finalAvatarUrl = upload.url;
    }

    await query(
      `UPDATE users
       SET first_name = ?, last_name = ?, username = ?, birthday = ?, bio = ?, avatar = ?, profile_completed = 1
       WHERE id = ?`,
      [firstName, lastName, username, birthday, bio, finalAvatarUrl, user.id]
    );

    return NextResponse.json({ message: 'Profile completed.' });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to complete onboarding.' }, { status: 500 });
  }
}
