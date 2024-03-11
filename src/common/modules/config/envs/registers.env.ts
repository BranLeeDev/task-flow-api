import { registerAs } from '@nestjs/config';
import { ENV } from './variables.env';

export default registerAs('registers', () => {
  if (ENV === 'production') {
    return {};
  }

  return {};
});
