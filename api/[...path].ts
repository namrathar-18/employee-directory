import type { IncomingMessage, ServerResponse } from 'http';
import { createApp } from '../server/src/app';
import { connectDb } from '../server/src/config/db';
import { env } from '../server/src/config/env';

// A single serverless function that hands every /api/* request to the Express app.
const app = createApp();
let dbReady: Promise<unknown> | null = null;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!dbReady) dbReady = connectDb(env.mongoUri);
  await dbReady;

  // Depending on how the platform routes the request the "/api" prefix may be
  // missing — add it back so the Express routes still match.
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url}`;
  }

  (app as unknown as (request: IncomingMessage, response: ServerResponse) => void)(req, res);
}
