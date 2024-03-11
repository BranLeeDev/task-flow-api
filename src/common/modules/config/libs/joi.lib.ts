import * as Joi from 'joi';

const DEV = 'development';
const PROD = 'production';

const NODE_ENV = Joi.string().valid(DEV, PROD).required();
const PORT = Joi.number().integer().min(1000).required();
const NAME = Joi.string().min(3).max(30).required();
const EMAIL = Joi.string().email().min(10).required();

export const joiConfigSchema = Joi.object({
  NODE_ENV,
  PORT,
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
});
