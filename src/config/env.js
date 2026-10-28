import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export const config = {
  port: process.env.PORT ?? 8080,
  mongoUri: process.env.MONGO_URI,
  saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
  secret: process.env.JWT_SECRET,
};
