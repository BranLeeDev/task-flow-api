import * as Joi from 'joi';

const DEV = 'development';
const PROD = 'production';

const NODE_ENV = Joi.string().valid(DEV, PROD).required();
const PORT = Joi.number().integer().positive().required();
const NAME = Joi.string().min(3).max(30).required();
const EMAIL = Joi.string().email().min(10).required();
const URI = Joi.string().uri().required();

export const joiConfigSchema = Joi.object({
  NODE_ENV,
  PORT,
  DATABASE_URL: Joi.when('NODE_ENV', {
    is: PROD,
    then: URI,
  }),
  POSTGRES_DB: Joi.when('NODE_ENV', {
    is: DEV,
    then: NAME,
  }),
  POSTGRES_USER: Joi.when('NODE_ENV', {
    is: DEV,
    then: NAME,
  }),
  POSTGRES_PASSWORD: Joi.when('NODE_ENV', {
    is: DEV,
    then: NAME,
  }),
  POSTGRES_HOST: Joi.when('NODE_ENV', {
    is: DEV,
    then: NAME,
  }),
  POSTGRES_PORT: Joi.when('NODE_ENV', {
    is: DEV,
    then: PORT,
  }),
  PGADMIN_EMAIL: Joi.when('NODE_ENV', {
    is: DEV,
    then: EMAIL,
  }),
  PGADMIN_PASSWORD: Joi.when('NODE_ENV', {
    is: DEV,
    then: NAME,
  }),
  PGADMIN_HOST_PORT: Joi.when('NODE_ENV', {
    is: DEV,
    then: PORT,
  }),
  PGADMIN_PORT: Joi.when('NODE_ENV', {
    is: DEV,
    then: PORT,
  }),
  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.number()
    .integer()
    .positive()
    .required(),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.number()
    .positive()
    .integer()
    .required(),
  COOKIE_SECRET: Joi.string().required(),
  JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
  JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.number()
    .integer()
    .positive()
    .required(),
  JWT_PASSWORD_RESET_TOKEN_SECRET: Joi.string().required(),
  JWT_PASSWORD_RESET_TOKEN_EXPIRATION_TIME: Joi.number()
    .integer()
    .positive()
    .required(),
  PASSWORD_RESET_URL: Joi.string().required(),
  EMAIL_CONFIRMATION_URL: URI,
  EMAIL_SERVICE: Joi.string().required(),
  EMAIL_USER: Joi.string().required(),
  EMAIL_PASSWORD: Joi.string().required(),
  MASTER_PASSWORD: Joi.string().required(),
  REDIS_HOST: Joi.string().min(8).max(100).required(),
  REDIS_PORT: PORT,
  REDIS_PASSWORD: Joi.when('NODE_ENV', {
    is: PROD,
    then: Joi.string().min(30).required(),
  }),
});
