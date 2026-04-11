import { NextResponse } from 'next/server';
import { hasTable, query, toJSONSafe } from '@/utils/db';
import { getUserFromRequest } from '@/utils/auth';

function getPagination(searchParams, defaultLimit = 5, maxLimit = 20) {
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.min(maxLimit, Math.max(1, Number(searchParams.get('limit')) || defaultLimit));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export async function GET(req) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }
    const savedPostsAvailable = await hasTable('saved_posts');
    if (!savedPostsAvailable) {
      return NextResponse.json(toJSONSafe({
        posts: [],
        pagination: {
          page: 1,
          limit: 5,
          total: 0,
          hasMore: false
        },
        warning: 'saved_posts table is missing'
      }));
    }

    const { searchParams } = new URL(req.url);
    const { page, limit, offset } = getPagination(searchParams);
    const totalRows = await query('SELECT COUNT(*) AS count FROM saved_posts WHERE user_id = ?', [user.id]);
    const total = totalRows[0]?.count || 0;

    const posts = await query(
      `SELECT posts.id, posts.user_id, posts.content, posts.media_url, posts.media_type, posts.created_at, posts.updated_at,
        users.first_name, users.last_name, users.username, users.avatar AS author_avatar,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) AS comment_count,
        1 AS saved,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id AND user_id = ?) AS liked
      FROM saved_posts
      JOIN posts ON posts.id = saved_posts.post_id
      JOIN users ON posts.user_id = users.id
      WHERE saved_posts.user_id = ?
      ORDER BY saved_posts.created_at DESC
      LIMIT ? OFFSET ?`,
      [user.id, user.id, limit, offset]
    );

    return NextResponse.json(toJSONSafe({
      posts,
      pagination: {
        page,
        limit,
        total,
        hasMore: offset + posts.length < total
      }
    }));
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch saved posts.' }, { status: 500 });
  }
}
