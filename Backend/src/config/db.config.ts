import mongoose from 'mongoose';
import { config } from './app.config';

const dbconfig = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('mongodb is connected');
  } catch (error) {
    console.log('Mongodb connection error:', error);
    process.exit(1);
  }
};

export default dbconfig;
