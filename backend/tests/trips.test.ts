// tests/trips.test.ts
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/db';

describe('Trips Integration Tests', () => {
  let token: string;
  let userId: string;
  let testTripId: string;
  const uniqueEmail = `test_trips_${Date.now()}@globetrotter.com`;

  beforeAll(async () => {
    // Register user to obtain active token
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Trips Tester',
        email: uniqueEmail,
        password: 'password123'
      });
    token = res.body.data.token;
    userId = res.body.data.user.id;
  });

  afterAll(async () => {
    // Cleanup created test records
    await prisma.trip.deleteMany({
      where: { userId: userId }
    });
    await prisma.user.delete({
      where: { id: userId }
    });
    await prisma.$disconnect();
  });

  it('should create a new trip plan', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Honeymoon in Europe',
        startDate: '2026-08-01',
        endDate: '2026-08-10',
        description: 'Romantic getaway',
        budgetLimit: 4000
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    testTripId = res.body.data.id;
  });

  it('should list all trips owned by the user', async () => {
    const res = await request(app)
      .get('/api/trips')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].id).toBe(testTripId);
  });

  it('should bulk upsert stops and activities in a single transaction', async () => {
    const res = await request(app)
      .put(`/api/trips/${testTripId}/stops`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        stops: [
          {
            cityId: 'c1', // Paris
            arrivalDate: '2026-08-01',
            departureDate: '2026-08-05',
            accommodationCost: 150,
            transportCost: 80,
            orderIndex: 0,
            activities: [
              { name: 'Eiffel Tower Tour', cost: 45, category: 'Sightseeing', duration: 2, date: '2026-08-02', time: '10:00' },
              { name: 'Louvre Visit', cost: 22, category: 'Sightseeing', duration: 3, date: '2026-08-03', time: '14:00' }
            ]
          },
          {
            cityId: 'c3', // Rome
            arrivalDate: '2026-08-05',
            departureDate: '2026-08-10',
            accommodationCost: 110,
            transportCost: 120,
            orderIndex: 1,
            activities: [
              { name: 'Colosseum Guided Tour', cost: 50, category: 'Sightseeing', duration: 3, date: '2026-08-06', time: '09:00' }
            ]
          }
        ]
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0].activities.length).toBe(2);
    expect(res.body.data[1].activities.length).toBe(1);
  });

  it('should retrieve complete trip breakdown with populated city info', async () => {
    const res = await request(app)
      .get(`/api/trips/${testTripId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.stops[0].city.name).toBe('Paris');
    expect(res.body.data.stops[1].city.name).toBe('Rome');
  });

  it('should allow public access to public shared trips without token', async () => {
    // 1. Mark trip public
    await request(app)
      .put(`/api/trips/${testTripId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isPublic: true });

    // 2. Fetch without token
    const res = await request(app)
      .get(`/api/trips/${testTripId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Honeymoon in Europe');
  });

  it('should clone a public trip into the users profile', async () => {
    const res = await request(app)
      .post(`/api/trips/${testTripId}/clone`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Copy of Honeymoon in Europe');
    expect(res.body.data.isPublic).toBe(false); // Reset to private
  });

  it('should delete a trip and verify cascade deletion of stops & activities', async () => {
    const res = await request(app)
      .delete(`/api/trips/${testTripId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    // Verify database counts are zero for stops and activities on that trip
    const stopsCount = await prisma.stop.count({ where: { tripId: testTripId } });
    expect(stopsCount).toBe(0);
  });
});
