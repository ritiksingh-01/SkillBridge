const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server');

describe('API Health and Routing Tests', () => {
  afterAll(async () => {
    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  test('GET /api/health should return 200 with status OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toMatch(/ok/i);
    expect(res.body).toHaveProperty('timestamp');
  });

  test('GET non-existent endpoint should return 404', async () => {
    const res = await request(app).get('/api/non-existent-test-route-1234');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  test('POST /api/auth/login with missing credentials should return 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('POST /api/auth/register with short password should fail validation', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'test_short_pwd@example.com',
        password: '123'
      });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});
