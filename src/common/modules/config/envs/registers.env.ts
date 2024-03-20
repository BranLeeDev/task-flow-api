import { registerAs } from '@nestjs/config';

export default registerAs('registers', () => {
  return {
    isProd: process.env.NODE_ENV === 'production',
    db: {
      postgres: {
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        name: process.env.POSTGRES_DB,
        url: process.env.DATABASE_URL,
      },
    },
    jwt: {
      accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
      accessTokenExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
      refreshTokenExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    },
    cookieSecret: process.env.COOKIE_SECRET,
  };
});
