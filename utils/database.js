import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('[DB] Already connected');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'promptia',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      maxPoolSize: 10,
      minPoolSize: 5,
    });

    isConnected = true;
    console.log('[DB] Successfully connected to MongoDB');
  } catch (error) {
    console.error('[DB] Connection failed:', error.message);
    isConnected = false;
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
};

export const disconnectDB = async () => {
  try {
    if (isConnected) {
      await mongoose.disconnect();
      isConnected = false;
      console.log('[DB] Disconnected from MongoDB');
    }
  } catch (error) {
    console.error('[DB] Disconnect error:', error.message);
  }
};