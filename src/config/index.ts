import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  databaseurl: process.env.DATABASE_URL as string,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecretKey: process.env.JWT_SECRET_KEY as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
};
export default config;
