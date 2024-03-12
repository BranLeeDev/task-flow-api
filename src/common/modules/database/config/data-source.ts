import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const ENV = process.env.NODE_ENV as 'development' | 'production';

let DATABASE_URL: string;
if (ENV === 'production') {
  DATABASE_URL = process.env.DATABASE_URL as string;
} else {
  const USER = encodeURIComponent(process.env.POSTGRES_USER as string);
  const PASSWORD = encodeURIComponent(process.env.POSTGRES_PASSWORD as string);
  const HOST = process.env.POSTGRES_HOST;
  const PORT = process.env.POSTGRES_PORT;
  const NAME = process.env.POSTGRES_DB;

  DATABASE_URL = `postgresql://${USER}:${PASSWORD}@${HOST}:${PORT}/${NAME}`;
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: ['src/**/*.entity.{ts,js}'],
  migrations: ['src/common/modules/database/migrations/*.{ts,js}'],
  migrationsTableName: 'migrations',
});
