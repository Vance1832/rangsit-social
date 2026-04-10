import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/utils/auth';
import { IMAGE_TYPES, saveUpload } from '@/utils/upload';

export async function POST(req) {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const upload = await saveUpload(file, IMAGE_TYPES, {
      folder: 'rangsit-social/profile-images',
      resourceType: 'image'
    });

    return NextResponse.json({
      url: upload.url,
      mediaType: upload.type
    });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Failed to upload profile image.' }, { status: 400 });
  }
}
