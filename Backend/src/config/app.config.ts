import { getEnv } from './../utils/getEnv';

const appconfig = () => ({
  PORT: getEnv('PORT', '8080'),
  MONGO_URI: getEnv('MONGO_URI', ''),
  FRONTEND_ORIGIN: getEnv('FRONTEND_ORIGIN', '*'),
  JWT_SECRET: getEnv('JWT_SECRET', ''),
  JWT_EXPIRES: getEnv('JWT_EXPIRES', ''),
});

export const config = appconfig();
