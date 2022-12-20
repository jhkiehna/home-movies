const sessionOptions = {
  cookieName: 'home-movies-session',
  password: process.env.APPLICATION_PASSWORD as string,
  ttl: 60 * 60 * 24 * 7,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export default sessionOptions;
