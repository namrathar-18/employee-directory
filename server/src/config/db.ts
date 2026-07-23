import mongoose from 'mongoose';

let isConnected = false;

/**
 * Connects to MongoDB and reuses the connection if one already exists.
 * The reuse guard matters for serverless environments where the module can be
 * evaluated more than once.
 */
export async function connectDb(uri: string): Promise<typeof mongoose> {
  if (isConnected) return mongoose;

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
  isConnected = true;

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
  });

  return mongoose;
}
