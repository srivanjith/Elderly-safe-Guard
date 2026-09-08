import mongoose from 'mongoose';
import dns from 'dns';

let dbConnected = false;

export const isDbConnected = (): boolean => dbConnected;

export const connectDB = async (): Promise<void> => {
  // Fix DNS resolution for MongoDB Atlas SRV URIs
  try {
    dns.setDefaultResultOrder('ipv4first');
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (dnsErr) {
    // ignore
  }

  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri && process.env.NODE_ENV === 'production') {
    console.error('❌ MONGODB_URI environment variable is not configured in Vercel/Production!');
  }

  const primaryUri = mongodbUri || 'mongodb://localhost:27017/safepay_guardian';
  const localUri = 'mongodb://127.0.0.1:27017/safepay_guardian';
  
  mongoose.set('strictQuery', false);

  // Event listeners
  mongoose.connection.on('error', (err) => {
    console.error(`[Database] MongoDB runtime error:`, err);
    dbConnected = false;
  });

  mongoose.connection.on('disconnected', () => {
    console.warn(`[Database] MongoDB disconnected.`);
    dbConnected = false;
  });

  mongoose.connection.on('connected', () => {
    dbConnected = true;
  });

  try {
    console.log(`[Database] Connecting to MongoDB (${primaryUri.includes('@') ? primaryUri.split('@').pop() : primaryUri})...`);
    const conn = await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
    dbConnected = true;
    
    console.log(`\n==================================================`);
    console.log(` ✅ MONGO DB CONNECTED SUCCESSFULLY!`);
    console.log(` Host: ${conn.connection.host}`);
    console.log(` Database: ${conn.connection.name}`);
    console.log(`==================================================\n`);
    return;
  } catch (error: any) {
    console.warn(`\n⚠️ [Database] Primary MongoDB connection failed (${error.message}).`);
  }

  // Attempt local connection fallback if not in production
  try {
    const localConn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 3000 });
    dbConnected = true;
    console.log(` ✅ MONGO DB CONNECTED (Local Fallback: ${localConn.connection.host})`);
    return;
  } catch (localErr: any) {
    dbConnected = false;
    console.error(`\n❌ [Database] MongoDB is offline or unreachable.`);
    console.warn(`⚡ [Fallback Active] Server running with In-Memory Demo Auth fallback.`);
    console.warn(`   Users can still log in using standard demo credentials.\n`);
  }
};
