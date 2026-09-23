import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB conectado');
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
};
