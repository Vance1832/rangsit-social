import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { getUserFromRequest } from '@/utils/auth';

export async function POST(req) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }
    if (!user.profile_completed) {
      return NextResponse.json({ message: 'Complete your profile first.' }, { status: 403 });
    }

    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ message: 'User id is required.' }, { status: 400 });
    }
    if (Number(userId) === user.id) {
      return NextResponse.json({ message: 'Cannot follow yourself.' }, { status: 400 });
    }

    const existing = await query(
      'SELECT id FROM follows WHERE follower_id = ? AND following_id = ?',
      [user.id, userId]
    );

    if (existing.length) {
      await query('DELETE FROM follows WHERE id = ?', [existing[0].id]);
      return NextResponse.json({ following: false });
    }

    await query('INSERT INTO follows (follower_id, following_id, created_at) VALUES (?, ?, NOW())', [
      user.id,
      userId
    ]);

    return NextResponse.json({ following: true });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to toggle follow.' }, { status: 500 });
  }
}
