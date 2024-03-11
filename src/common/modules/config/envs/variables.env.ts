import * as dotenv from 'dotenv';

const NODE_ENV = process.env.NODE_ENV as 'production' | 'development';

dotenv.config();
const envVariables = {
  env: NODE_ENV,
  port: Number(process.env.PORT),
  isProd: NODE_ENV === 'production',
};

export const isProd = envVariables.isProd;
export const PORT = envVariables.port;
export const ENV = envVariables.env;
