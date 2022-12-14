import Head from 'next/head';
import { type NextPage } from 'next';
import { useState, type MouseEvent } from 'react';
import { withIronSessionSsr } from 'iron-session/next';
import { S3Client, ListObjectsV2Command, type _Object } from '@aws-sdk/client-s3';

import type { CustomIronSession } from '../../utils/types';
import sessionOptions from '../../utils/sessionOptions';
import styles from '../index.module.css';

interface MovieObject extends _Object {
  FileName: string;
  presignedUrl: string;
}

const HomeMovies: NextPage<{ movieObjects: MovieObject[] }> = ({ movieObjects }) => {
  const [displayedMovieKey, setDisplayedMovieKey] = useState<string | null>(null);
  const [displayedMovieUrl, setDisplayedMovieUrl] = useState<string | null>(null);

  const handleStreamClick = async (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    key: string,
    filename: string,
  ) => {
    e.preventDefault();

    const response = await fetch(`/api/presigned-url?key=${key}&filename=${filename}`);

    if (response.status === 401) window.location.replace('/login');

    const { presignedUrl } = await response.json();

    setDisplayedMovieKey(key);
    setDisplayedMovieUrl(presignedUrl);
  };

  const handleDownloadClick = async (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    key: string,
    filename: string,
  ) => {
    e.preventDefault();

    const response = await fetch(`/api/presigned-url?key=${key}&filename=${filename}`);

    if (response.status === 401) window.location.replace('/login');

    const { presignedUrl } = await response.json();

    window.open(presignedUrl, '_blank');
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

                  <div className={styles.videolinks}>
                    <a href="" onClick={(e) => handleStreamClick(e, object.Key as string, object.FileName)}>
                      Stream Here
                    </a>
                    <span>{' | '}</span>
                    <a href="" onClick={(e) => handleDownloadClick(e, object.Key as string, object.FileName)}>
                      Download
                    </a>
                  </div>

                  {displayedMovieKey === object.Key && displayedMovieUrl ? (
                    <video controls={true} className={styles.video} playsInline autoPlay>
                      <source src={displayedMovieUrl} type="video/mp4"></source>
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

export default HomeMovies;

export const getServerSideProps = withIronSessionSsr(async function getServerSideProps({ req }) {
  if (!(req.session as CustomIronSession)?.user?.isLoggedIn) {
    req.session.destroy();

    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

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

  const movies = compressedMovies.map((movie) => ({ ...movie, FileName: movie.Key?.split('/')?.[0] }));

  return { props: { movieObjects: JSON.parse(JSON.stringify(movies)) } };
}, sessionOptions);
