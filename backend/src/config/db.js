import mongoose from 'mongoose';
import pino from 'pino';
import { env } from './env.js';

const logger = pino();

export const connectDB = async () => {
  try {
    // Listen to connection events
    mongoose.connection.on('connected', () => logger.info('MongoDB connected successfully'));
    mongoose.connection.on('error', (err) => logger.error(`MongoDB connection error: ${err.message}`));
    mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));

    await mongoose.connect(env.MONGO_URI);
  } catch (error) {
    logger.error(`Initial MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
};