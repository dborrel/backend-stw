
require('dotenv').config();
// Use a dedicated test database with authentication, matching Docker credentials
process.env.MONGODB_URI = process.env.MONGODB_URI_TEST 
  || 'mongodb://eventadmin:eventpassword@localhost:27017/eventconnect_test?authSource=admin';
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

jest.setTimeout(20000); // 20 segundos

describe('Auth Controller', () => {
  let server;
  beforeAll(async () => {
    await connectDB();
    server = app.listen(4001);
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    // Cierra la conexión solo si sigue abierta
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    if (server && server.close) await server.close();
  });

  describe('POST /api/auth/register', () => {
    it('debe registrar un usuario nuevo', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          username: 'testuser',
          email: 'testuser@example.com',
          password: '12345678'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.user).toHaveProperty('email', 'testuser@example.com');
    });
    it('debe rechazar registro duplicado', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          username: 'testuser',
          email: 'testuser@example.com',
          password: '12345678'
        });
      const res = await request(server)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          username: 'testuser',
          email: 'testuser@example.com',
          password: '12345678'
        });
      expect(res.statusCode).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    it('debe hacer login correctamente', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({
          name: 'Login User',
          username: 'loginuser',
          email: 'loginuser@example.com',
          password: '12345678'
        });
      const res = await request(server)
        .post('/api/auth/login')
        .send({
          email: 'loginuser@example.com',
          password: '12345678'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty('email', 'loginuser@example.com');
    });
    it('debe rechazar login con contraseña incorrecta', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({
          email: 'loginuser@example.com',
          password: 'wrongpassword'
        });
      expect(res.statusCode).toBe(401);
    });
  });

  // Puedes añadir más tests para /profile, /refresh, etc.
});
