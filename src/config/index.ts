import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  databaseurl: process.env.DATABASE_URL as string,
  nodeEnv: process.env.NODE_ENV || 'development',
};
export default config;
