import { NextResponse } from 'next/server';
import { hasTable, query, toCountNumber, toJSONSafe } from '@/utils/db';
import { getUserFromRequest } from '@/utils/auth';

function getPagination(searchParams, defaultLimit = 5, maxLimit = 20) {
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.min(maxLimit, Math.max(1, Number(searchParams.get('limit')) || defaultLimit));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export async function GET(req, { params }) {
  try {
    const user = await getUserFromRequest();
    const userId = user?.id || 0;
    const { searchParams } = new URL(req.url);
    const { page, limit, offset } = getPagination(searchParams);

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
    const postTotals = await query('SELECT COUNT(*) AS count FROM posts WHERE user_id = ?', [params.id]);
    const totalPosts = toCountNumber(postTotals[0]?.count);
    const savedPostsAvailable = await hasTable('saved_posts');
    const savedSelect = savedPostsAvailable
      ? '(SELECT COUNT(*) FROM saved_posts WHERE post_id = posts.id AND user_id = ?) AS saved'
      : '0 AS saved';

    const posts = await query(
      `SELECT posts.id, posts.user_id, posts.content, posts.media_url, posts.media_type, posts.created_at, posts.updated_at,
        users.first_name, users.last_name, users.username, users.avatar AS author_avatar,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) AS comment_count,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id AND user_id = ?) AS liked,
        ${savedSelect}
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.user_id = ?
      ORDER BY posts.created_at DESC
      LIMIT ? OFFSET ?`,
      savedPostsAvailable
        ? [userId, userId, params.id, limit, offset]
        : [userId, params.id, limit, offset]
    );

    return NextResponse.json(toJSONSafe({
      user: profile,
      stats: {
        followers: toCountNumber(followers[0]?.count),
        following: toCountNumber(following[0]?.count),
        isFollowing: !!isFollowing[0]?.count
      },
      posts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        hasMore: offset + posts.length < totalPosts
      }
    }));
  } catch (err) {
    console.error('[api/users/[id]] GET failed', { id: params?.id, error: err });
    return NextResponse.json({ message: 'Failed to fetch user.' }, { status: 500 });
  }
}
