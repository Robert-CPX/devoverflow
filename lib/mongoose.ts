import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);

  if(isConnected) {
    return console.log('=> MongoDB is already connected');
  }
  if(!process.env.MONGODB_URL) {
    return console.log('=> MongoDB URL not found');
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: 'devoverflow',
    });
    isConnected = true;
    console.log('=> MongoDB connected')
  } catch (error) {
    console.log('=> MongoDB connection error: ', error);
  }
}
