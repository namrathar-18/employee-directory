import { createApp } from './app';
import { connectDb } from './config/db';
import { env } from './config/env';

async function start() {
  await connectDb(env.mongoUri);
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB');

  const app = createApp();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API ready at http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start the server:', error);
  process.exit(1);
});
