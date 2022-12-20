import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { CustomIronSession } from '../../utils/types';
import sessionOptions from '../../utils/sessionOptions';

interface PresignedUrlRequest extends NextApiRequest {
  query: {
    key: string;
    filename: string;
  };
}

export default withIronSessionApiRoute(presignedUrlRoute, sessionOptions);

async function presignedUrlRoute(req: NextApiRequest, res: NextApiResponse) {
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } = process.env;
  const { key, filename } = (req as PresignedUrlRequest).query;

  if (!(req.session as CustomIronSession)?.user?.isLoggedIn) {
    req.session.destroy();

    return res.status(401).send('Unauthorized');
  }

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
