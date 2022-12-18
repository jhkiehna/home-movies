import type { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } = process.env;

  const s3 = new S3Client({
    region: 'us-east-1',
    credentials: { accessKeyId: AWS_ACCESS_KEY_ID as string, secretAccessKey: AWS_SECRET_ACCESS_KEY as string },
  });

  const result = await s3.send(
    new GetObjectCommand({ Bucket: AWS_BUCKET_NAME as string, Key: req.query.key as string }),
  );

  // Stream object from s3 with response
  if (!result.Body || !result.Body) res.status(404).end();

  const readableStream: ReadableStream = result.Body!.transformToWebStream();

  res.status(200).send(readableStream);
}
