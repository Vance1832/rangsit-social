import { getCloudinary } from './cloudinary';
import { Readable } from 'stream';

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'];
export const MEDIA_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];

export function getMediaKind(mimeType) {
  if (IMAGE_TYPES.includes(mimeType)) return 'image';
  if (VIDEO_TYPES.includes(mimeType)) return 'video';
  return null;
}

export function assertAllowedFile(file, allowedTypes) {
  if (!file || typeof file === 'string') {
    throw new Error('A file is required.');
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Unsupported file type.');
  }
}

export async function saveUpload(file, allowedTypes, options = {}) {
  assertAllowedFile(file, allowedTypes);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const resourceType = options.resourceType || (getMediaKind(file.type) === 'video' ? 'video' : 'image');
  const folder = options.folder || 'rangsit-social';

  const cloudinary = getCloudinary();
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType
      },
      (error, uploadResult) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(uploadResult);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });

  return {
    url: result.secure_url,
    type: getMediaKind(file.type),
    publicId: result.public_id
  };
}
