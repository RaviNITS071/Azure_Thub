import pino from 'pino';
import { env } from '../config/env.js';

const logger = pino();

export const globalErrorHandler = (err, req, res, next) => {
  logger.error(err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Handle Mongoose unique constraint errors gracefully
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Resource already exists.', field: Object.keys(err.keyValue) });
  }

  res.status(status).json({
    error: message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack })
  });
};