import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { getUserFromRequest } from '@/utils/auth';

export async function GET(req, { params }) {
  try {
    const likes = await query('SELECT COUNT(*) AS count FROM likes WHERE post_id = ?', [params.id]);
    return NextResponse.json({ count: likes[0]?.count || 0 });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to fetch likes.' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }
    if (!user.profile_completed) {
      return NextResponse.json({ message: 'Complete your profile first.' }, { status: 403 });
    }

    const existing = await query('SELECT id FROM likes WHERE post_id = ? AND user_id = ?', [params.id, user.id]);
    if (existing.length) {
      await query('DELETE FROM likes WHERE id = ?', [existing[0].id]);
      return NextResponse.json({ liked: false });
    }

    await query('INSERT INTO likes (post_id, user_id, created_at) VALUES (?, ?, NOW())', [params.id, user.id]);
    return NextResponse.json({ liked: true });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to toggle like.' }, { status: 500 });
  }
}
