import fs from 'fs';
import path from 'path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const bucket = process.env.S3_BUCKET;
const region = process.env.S3_REGION;
const accessKeyId = process.env.S3_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_KEY;
const publicBase = process.env.PUBLIC_BASE_URL || '';

const hasS3Config = !!(bucket && region && accessKeyId && secretAccessKey);

const s3Client = hasS3Config
  ? new S3Client({
      region,
      credentials: {
        accessKeyId: accessKeyId as string,
        secretAccessKey: secretAccessKey as string,
      },
    })
  : null;

export async function uploadBuffer(
  file: Express.Multer.File | undefined,
  prefix: string
): Promise<string | undefined> {
  if (!file) return undefined;

  const key = `${prefix}/${Date.now()}-${file.originalname.replace(/\\s+/g, '-')}`;

  if (s3Client && hasS3Config && bucket) {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await s3Client.send(command);
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  }

  const uploadsRoot = path.join(__dirname, '..', 'uploads');
  const localDir = path.join(uploadsRoot, prefix);
  await fs.promises.mkdir(localDir, { recursive: true });
  const localPath = path.join(localDir, path.basename(key));
  await fs.promises.writeFile(localPath, file.buffer);
  const relative = `/uploads/${prefix}/${path.basename(key)}`;
  return publicBase ? `${publicBase}${relative}` : relative;
}
