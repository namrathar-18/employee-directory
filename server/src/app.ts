import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { router } from './routes';
import { notFound, errorHandler } from './middleware/errorHandler';
import { env, isProd } from './config/env';

export function createApp() {
  const app = express();

  const origins = env.clientOrigin.split(',').map((o) => o.trim());
  app.use(cors({ origin: origins.includes('*') ? true : origins }));
  app.use(express.json());
  if (!isProd) app.use(morgan('dev'));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', uptime: Math.round(process.uptime()) });
  });

  app.use('/api', router);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
