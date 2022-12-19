import styles from './index.module.css';
import { type NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>JHKiehna</title>
        <meta name="description" content="JHKiehna.dev" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Nothing to see here</h1>
          <Image src="/cat-christmas.jpg" alt="cat-christmas" width={634} height={416} className={styles.catimage} />
        </div>
      </main>
    </>
  );
};

export default Home;
