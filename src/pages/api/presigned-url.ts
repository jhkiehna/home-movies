import type { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface PresignedUrlRequest extends NextApiRequest {
  query: {
    key: string;
    filename: string;
  };
}

export default async function handler(req: PresignedUrlRequest, res: NextApiResponse) {
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } = process.env;
  const { key, filename } = req.query;

  const s3 = new S3Client({
    region: 'us-east-1',
    credentials: { accessKeyId: AWS_ACCESS_KEY_ID as string, secretAccessKey: AWS_SECRET_ACCESS_KEY as string },
  });

  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME as string,
    Key: key,
    ResponseContentDisposition: `attachment;filename=${filename}`,
  });
  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 24 });

  res.status(200).json({ presignedUrl });
}
