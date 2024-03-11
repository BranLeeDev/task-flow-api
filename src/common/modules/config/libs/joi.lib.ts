import * as Joi from 'joi';

const NODE_ENV = Joi.string().valid('development', 'production').required();
const PORT = Joi.number().integer().min(1000).required();

export const joiConfigSchema = Joi.object({
  NODE_ENV,
  PORT,
});
