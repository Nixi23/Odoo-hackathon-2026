// tests/auth.test.ts
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/db';

describe('Auth Integration Tests', () => {
  const uniqueEmail = `test_${Date.now()}_${Math.random().toString(36).substr(2, 5)}@globetrotter.com`;
  const password = 'testpassword123';

  // Wipe test users after suite
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { startsWith: 'test_' } }
    });
    await prisma.$disconnect();
  });

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Runner',
        email: uniqueEmail,
        password: password
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.email).toBe(uniqueEmail);
  });

  it('should return error when registering with a duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another Name',
        email: uniqueEmail,
        password: password
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should log in successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: password
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should deny login for incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: 'wrongpassword'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should deny access to protected routes without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('should retrieve logged in user profile with valid token', async () => {
    // Get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: password
      });
    const token = loginRes.body.data.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(uniqueEmail);
  });
});
