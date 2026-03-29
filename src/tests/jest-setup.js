const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

module.exports = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  process.env.MONGODB_URI = mongoUri;
  process.env.NODE_ENV = 'test';
  
  console.log('✓ MongoMemoryServer iniciado en:', mongoUri);
  
  // Almacena el server en global para poder cerrarlo después
  global.__MONGO_SERVER__ = mongoServer;
};
