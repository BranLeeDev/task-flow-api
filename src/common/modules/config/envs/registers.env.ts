import { registerAs } from '@nestjs/config';
import { ENV } from './variables.env';

export default registerAs('registers', () => {
  if (ENV === 'production') {
    return {
      db: {
        postgres: {
          url: process.env.DATABASE_URL,
        },
      },
    };
  }

  return {
    db: {
      postgres: {
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        name: process.env.POSTGRES_DB,
      },
    },
  };
});
