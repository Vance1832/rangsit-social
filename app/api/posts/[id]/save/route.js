import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { getUserFromRequest } from '@/utils/auth';

export async function POST(req, { params }) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }
    if (!user.profile_completed) {
      return NextResponse.json({ message: 'Complete your profile first.' }, { status: 403 });
    }

    const existing = await query('SELECT id FROM saved_posts WHERE post_id = ? AND user_id = ?', [params.id, user.id]);
    if (existing.length) {
      await query('DELETE FROM saved_posts WHERE id = ?', [existing[0].id]);
      return NextResponse.json({ saved: false });
    }

    await query('INSERT INTO saved_posts (post_id, user_id, created_at) VALUES (?, ?, NOW())', [params.id, user.id]);
    return NextResponse.json({ saved: true });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to toggle saved post.' }, { status: 500 });
  }
}
