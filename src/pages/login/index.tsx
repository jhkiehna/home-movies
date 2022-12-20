import Head from 'next/head';
import { type NextPage } from 'next';
import { useState, type FormEvent, type ChangeEvent } from 'react';

import styles from '../index.module.css';

const Login: NextPage = () => {
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/login`, { method: 'POST', body: JSON.stringify({ password }) });

      if (response.status === 200) return window.location.replace('/home-movies');

      setErrorMessage(await response.text());
    } catch (error) {
      setErrorMessage(String(error));
    }
  };

  const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (errorMessage) setErrorMessage(null);
    setPassword(e.target.value);
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Login</h1>

          <form onSubmit={handleFormSubmit} className={styles.loginform}>
            <input type="text" value={password} onChange={handlePasswordInputChange} />

            <input type="submit" value="Let me In!" />

            <div className={styles.errormessage}>
              <p>{errorMessage}</p>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Login;
