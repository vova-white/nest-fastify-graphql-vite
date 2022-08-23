import { config } from 'dotenv';
config();

export const appConfig = {
  APP_PORT: process.env.APP_PORT || 3000,
  APP_HOST: process.env.APP_HOST || '127.0.0.1',
  MONGO_URL: process.env.MONGO_URL,
};
