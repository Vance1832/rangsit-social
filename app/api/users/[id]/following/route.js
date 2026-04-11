import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { getUserFromRequest } from '@/utils/auth';

function getPagination(searchParams, defaultLimit = 8, maxLimit = 20) {
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.min(maxLimit, Math.max(1, Number(searchParams.get('limit')) || defaultLimit));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export async function GET(req, { params }) {
  try {
    const viewer = await getUserFromRequest();
    const viewerId = viewer?.id || 0;
    const { searchParams } = new URL(req.url);
    const { page, limit, offset } = getPagination(searchParams);
    const totalRows = await query('SELECT COUNT(*) AS count FROM follows WHERE follower_id = ?', [params.id]);
    const total = totalRows[0]?.count || 0;

    const users = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.username, u.bio, u.avatar,
        EXISTS(
          SELECT 1
          FROM follows my_follows
          WHERE my_follows.follower_id = ? AND my_follows.following_id = u.id
        ) AS isFollowing
      FROM follows f
      JOIN users u ON u.id = f.following_id
      WHERE f.follower_id = ?
      ORDER BY u.first_name ASC, u.username ASC
      LIMIT ? OFFSET ?`,
      [viewerId, params.id, limit, offset]
    );

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        hasMore: offset + users.length < total
      }
    });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch following.' }, { status: 500 });
  }
}
