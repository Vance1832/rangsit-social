import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { getUserFromRequest } from '@/utils/auth';

export async function GET(req, { params }) {
  try {
    const viewer = await getUserFromRequest();
    const viewerId = viewer?.id || 0;

    const users = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.username, u.bio, u.avatar,
        EXISTS(
          SELECT 1
          FROM follows my_follows
          WHERE my_follows.follower_id = ? AND my_follows.following_id = u.id
        ) AS isFollowing
      FROM follows f
      JOIN users u ON u.id = f.follower_id
      WHERE f.following_id = ?
      ORDER BY u.first_name ASC, u.username ASC`,
      [viewerId, params.id]
    );

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch followers.' }, { status: 500 });
  }
}
