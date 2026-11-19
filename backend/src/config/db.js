import mongoose from 'mongoose';

export const connectDb = (uri) => mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
export const disconnectDb = () => mongoose.disconnect();

export default {
  connect: connectDb,
  disconnect: disconnectDb,
};
