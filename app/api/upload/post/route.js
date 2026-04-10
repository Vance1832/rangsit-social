import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/utils/auth';
import { MEDIA_TYPES, getMediaKind, saveUpload } from '@/utils/upload';

export async function POST(req) {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    if (!user.profile_completed) {
      return NextResponse.json({ message: 'Complete your profile first.' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const mediaKind = getMediaKind(file?.type);

    const upload = await saveUpload(file, MEDIA_TYPES, {
      folder: 'rangsit-social/post-media',
      resourceType: mediaKind === 'video' ? 'video' : 'image'
    });

    return NextResponse.json({
      url: upload.url,
      mediaType: upload.type
    });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Failed to upload media.' }, { status: 400 });
  }
}
