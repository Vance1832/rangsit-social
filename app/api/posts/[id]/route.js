import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import { getUserFromRequest } from '@/utils/auth';
import { MEDIA_TYPES, saveUpload } from '@/utils/upload';

export async function GET(req, { params }) {
  try {
    const user = await getUserFromRequest();
    const userId = user?.id || 0;
    const posts = await query(
      `SELECT posts.id, posts.user_id, posts.content, posts.media_url, posts.media_type, posts.created_at, posts.updated_at,
        users.first_name, users.last_name, users.username, users.avatar AS author_avatar,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) AS comment_count,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id AND user_id = ?) AS liked,
        (SELECT COUNT(*) FROM saved_posts WHERE post_id = posts.id AND user_id = ?) AS saved
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.id = ?`,
      [userId, userId, params.id]
    );

    const post = posts[0];
    if (!post) {
      return NextResponse.json({ message: 'Post not found.' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to fetch post.' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }
    if (!user.profile_completed) {
      return NextResponse.json({ message: 'Complete your profile first.' }, { status: 403 });
    }

    const posts = await query('SELECT user_id, media_url, media_type FROM posts WHERE id = ?', [params.id]);
    const post = posts[0];
    if (!post) {
      return NextResponse.json({ message: 'Post not found.' }, { status: 404 });
    }
    if (post.user_id !== user.id) {
      return NextResponse.json({ message: 'Forbidden.' }, { status: 403 });
    }

    const formData = await req.formData();
    const content = (formData.get('content') || '').trim();
    const mediaUrlInput = formData.get('mediaUrl');
    const mediaTypeInput = formData.get('mediaType');
    const mediaFile = formData.get('media');
    const removeMedia = formData.get('removeMedia') === 'true';

    if (!content) {
      return NextResponse.json({ message: 'Post content is required.' }, { status: 400 });
    }
    if (content.length > 5000) {
      return NextResponse.json({ message: 'Post content must be 5000 characters or fewer.' }, { status: 400 });
    }

    let mediaUrl = post.media_url;
    let mediaType = post.media_type;

    if (removeMedia) {
      mediaUrl = null;
      mediaType = null;
    }

    if (mediaUrlInput) {
      mediaUrl = mediaUrlInput;
      mediaType = mediaTypeInput || mediaType;
    }

    if (!mediaUrlInput && mediaFile && typeof mediaFile !== 'string') {
      const upload = await saveUpload(mediaFile, MEDIA_TYPES, {
        folder: 'rangsit-social/post-media'
      });
      mediaUrl = upload.url;
      mediaType = upload.type;
    }

    await query(
      'UPDATE posts SET content = ?, media_url = ?, media_type = ?, updated_at = NOW() WHERE id = ?',
      [content, mediaUrl, mediaType, params.id]
    );

    return NextResponse.json({ message: 'Post updated.' });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to update post.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const posts = await query('SELECT user_id FROM posts WHERE id = ?', [params.id]);
    const post = posts[0];
    if (!post) {
      return NextResponse.json({ message: 'Post not found.' }, { status: 404 });
    }
    if (post.user_id !== user.id) {
      return NextResponse.json({ message: 'Forbidden.' }, { status: 403 });
    }

    await query('DELETE FROM posts WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Post deleted.' });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to delete post.' }, { status: 500 });
  }
}
