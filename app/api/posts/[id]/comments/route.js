import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { getUserFromRequest } from '@/utils/auth';

export async function GET(req, { params }) {
  try {
    const comments = await query(
      `SELECT comments.id, comments.content, comments.created_at,
        users.id AS user_id, users.first_name, users.last_name, users.username, users.avatar AS user_avatar
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = ?
      ORDER BY comments.created_at ASC`,
      [params.id]
    );
    return NextResponse.json({ comments });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to fetch comments.' }, { status: 500 });
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

    const { content } = await req.json();
    if (!content) {
      return NextResponse.json({ message: 'Comment content is required.' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())',
      [params.id, user.id, content]
    );

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to add comment.' }, { status: 500 });
  }
}
