import Head from 'next/head';
import { type NextPage } from 'next';
import { useState, type MouseEvent } from 'react';
import { S3Client, ListObjectsV2Command, GetObjectCommand, type _Object } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import styles from '../index.module.css';

interface MovieObject extends _Object {
  FileName: string;
  presignedUrl: string;
}

const HomeMovies: NextPage<{ movieObjects: MovieObject[] }> = ({ movieObjects }) => {
  const [displayedMovieKey, setDisplayedMovieKey] = useState<string | null>(null);

  const handleMovieClick = async (e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>, key: string) => {
    e.preventDefault();
    setDisplayedMovieKey(key);
  };

  return (
    <>
      <Head>
        <title>Home Movies</title>
        <meta name="description" content="Home movies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Home Movies</h1>

          <p>
            Downloading will open a new tab in certain browsers and attempt to play the file.
            <br />
            To prevent this, right click the link and select &quot; Save link as...&quot;
          </p>

          <ul>
            {movieObjects && movieObjects?.length > 0 ? (
              movieObjects.map((object) => (
                <li key={object.Key}>
                  <h2>{object.FileName}</h2>

                  <p>
                    <a href="" onClick={(e) => handleMovieClick(e, object.Key as string)}>
                      Stream Here
                    </a>
                    {' | '}
                    <a href={object.presignedUrl} rel="noopener noreferrer" download={object.FileName}>
                      Download
                    </a>
                  </p>

                  {displayedMovieKey === object.Key ? (
                    <video controls={true} className={styles.video} muted={false} autoPlay>
                      <source src={object.presignedUrl} type="video/mp4"></source>
                    </video>
                  ) : null}
                </li>
              ))
            ) : (
              <li>No movies found</li>
            )}
          </ul>
        </div>
      </main>
    </>
  );
};

export async function getStaticProps() {
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } = process.env;

  const s3 = new S3Client({
    region: 'us-east-1',
    credentials: { accessKeyId: AWS_ACCESS_KEY_ID as string, secretAccessKey: AWS_SECRET_ACCESS_KEY as string },
  });

  const result = await s3.send(new ListObjectsV2Command({ Bucket: AWS_BUCKET_NAME as string }));

  const compressedMovies = result.Contents?.filter(
    (object) => object.Key?.includes('compressed') && (object.Size ?? 0) > 0,
  );

  if (!compressedMovies) return { props: { movieObjects: [] } };

  const movies = await Promise.all(
    compressedMovies.map(async (object) => {
      const FileName = object.Key?.split('/')?.[0];

      const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME as string,
        Key: object.Key,
        ResponseContentDisposition: `attachment;filename=${FileName}`,
      });
      const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 24 });

      return {
        ...object,
        FileName,
        presignedUrl,
      };
    }),
  );

  return { props: { movieObjects: JSON.parse(JSON.stringify(movies)) } };
}

export default HomeMovies;
