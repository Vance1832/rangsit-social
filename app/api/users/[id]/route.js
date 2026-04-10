import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { getUserFromRequest } from '@/utils/auth';

export async function GET(req, { params }) {
  try {
    const user = await getUserFromRequest();
    const userId = user?.id || 0;

    const users = await query(
      `SELECT id, email, first_name, last_name, username, birthday, bio, avatar, profile_completed, created_at
       FROM users WHERE id = ?`,
      [params.id]
    );
    const profile = users[0];
    if (!profile) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    const followers = await query('SELECT COUNT(*) AS count FROM follows WHERE following_id = ?', [params.id]);
    const following = await query('SELECT COUNT(*) AS count FROM follows WHERE follower_id = ?', [params.id]);
    const isFollowing = await query(
      'SELECT COUNT(*) AS count FROM follows WHERE follower_id = ? AND following_id = ?',
      [userId, params.id]
    );

    const posts = await query(
      `SELECT posts.id, posts.user_id, posts.content, posts.media_url, posts.media_type, posts.created_at, posts.updated_at,
        users.first_name, users.last_name, users.username, users.avatar AS author_avatar,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) AS comment_count,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id AND user_id = ?) AS liked
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.user_id = ?
      ORDER BY posts.created_at DESC`,
      [userId, params.id]
    );

    return NextResponse.json({
      user: profile,
      stats: {
        followers: followers[0]?.count || 0,
        following: following[0]?.count || 0,
        isFollowing: !!isFollowing[0]?.count
      },
      posts
    });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to fetch user.' }, { status: 500 });
  }
}
