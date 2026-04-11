import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { getUserFromRequest } from '@/utils/auth';

export async function GET() {
  try {
    const viewer = await getUserFromRequest();

    if (!viewer) {
      return NextResponse.json({ users: [] });
    }

    const users = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.username, u.bio, u.avatar,
        EXISTS(
          SELECT 1
          FROM follows my_follows
          WHERE my_follows.follower_id = ? AND my_follows.following_id = u.id
        ) AS isFollowing,
        (
          SELECT COUNT(*)
          FROM follows audience
          WHERE audience.following_id = u.id
        ) AS followerCount
      FROM users u
      WHERE u.id != ? AND u.profile_completed = 1
      ORDER BY isFollowing ASC, followerCount DESC, u.created_at DESC
      LIMIT 5`,
      [viewer.id, viewer.id]
    );

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch suggestions.' }, { status: 500 });
  }
}
