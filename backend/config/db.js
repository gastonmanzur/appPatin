const mongoose = require('mongoose');
let memoryServer;

const connectDB = async () => {
  let uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  try {
    if (!uri) {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      uri = memoryServer.getUri();
      console.warn('Using in-memory MongoDB instance');
    }

    await mongoose.connect(uri);
    console.log('MongoDB conectado');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
