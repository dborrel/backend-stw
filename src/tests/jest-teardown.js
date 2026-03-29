const mongoose = require('mongoose');

module.exports = async () => {
  // Cierra la conexión de Mongoose
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  
  // Detiene el servidor en memoria
  if (global.__MONGO_SERVER__) {
    await global.__MONGO_SERVER__.stop();
    console.log('✓ MongoMemoryServer detenido');
  }
};
