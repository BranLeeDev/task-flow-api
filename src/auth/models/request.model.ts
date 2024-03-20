import { User } from '@entities/index';
import { FastifyRequest as Request } from 'fastify';

export interface FastifyRequest extends Request {
  user: User;
}
