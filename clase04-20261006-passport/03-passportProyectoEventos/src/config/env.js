import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export const config = {
  port: process.env.PORT ?? 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/?dbName=comis95275",
  saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
};
