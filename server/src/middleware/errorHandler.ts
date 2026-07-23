import { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';

export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Duplicate key (e.g. two employees with the same email)
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'field';
    return res.status(409).json({
      message: `An employee with that ${field} already exists`,
      details: [{ field, message: 'Already in use' }],
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: 'That identifier is not valid' });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message, details: err.details });
  }

  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on our end' });
};
