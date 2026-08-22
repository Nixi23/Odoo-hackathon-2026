// tests/explore.test.ts
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/db';

describe('Explore Integration Tests', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should fetch all cities', async () => {
    const res = await request(app).get('/api/explore/cities');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should filter cities by region', async () => {
    const res = await request(app)
      .get('/api/explore/cities?region=Europe');

    expect(res.status).toBe(200);
    expect(res.body.data.every((c: any) => c.region === 'Europe')).toBe(true);
  });

  it('should search cities by query name', async () => {
    const res = await request(app)
      .get('/api/explore/cities?search=Tokyo');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('Tokyo');
  });

  it('should fetch activities for a specific city', async () => {
    const res = await request(app).get('/api/explore/cities/c1/activities');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data.every((a: any) => a.cityId === 'c1')).toBe(true);
  });

  it('should filter activities by category and cost limit', async () => {
    const res = await request(app)
      .get('/api/explore/cities/c1/activities?category=Sightseeing&maxCost=30');

    expect(res.status).toBe(200);
    expect(res.body.data.every((a: any) => a.category === 'Sightseeing' && a.cost <= 30)).toBe(true);
  });
});
