import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: ['src/**/*.entity.{ts,js}'],
  migrations: ['src/common/modules/database/migrations/*.{ts,js}'],
  migrationsTableName: 'migrations',
});
