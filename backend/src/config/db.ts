import mongoose from 'mongoose';
import dns from 'dns';

export const connectDB = async (): Promise<void> => {
  // Fix Windows DNS resolution issue for MongoDB Atlas SRV URIs
  try {
    dns.setDefaultResultOrder('ipv4first');
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (dnsErr) {
    // ignore
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/safepay_guardian';
  
  try {
    mongoose.set('strictQuery', false);
    
    console.log(`[Database] Connecting to MongoDB...`);
    const conn = await mongoose.connect(uri);
    
    console.log(`\n==================================================`);
    console.log(` ✅ MONGO DB CONNECTED SUCCESSFULLY!`);
    console.log(` Host: ${conn.connection.host}`);
    console.log(` Database: ${conn.connection.name}`);
    console.log(`==================================================\n`);

    // Event listeners
    mongoose.connection.on('error', (err) => {
      console.error(`[Database] MongoDB runtime error:`, err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn(`[Database] MongoDB disconnected. Attempting to reconnect...`);
    });

  } catch (error: any) {
    console.error(`\n❌ [Database] MongoDB Connection Failed:`, error.message);
    console.warn(`📌 Verification Checklist:`);
    console.warn(` 1. Ensure IP address 0.0.0.0/0 (Allow Access from Anywhere) is added under Network Access in MongoDB Atlas.`);
    console.warn(` 2. Ensure your database username and password in backend/.env are correct.`);
    console.warn(` 3. If running locally, start MongoDB service on port 27017.\n`);
  }
};
