import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './index.js';

describe('API Endpoints', () => {
  describe('GET /api/health', () => {
    it('returns health status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  describe('GET /api/sponsors', () => {
    it('returns an array of sponsors', async () => {
      const response = await request(app).get('/api/sponsors');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('sponsors have required fields', async () => {
      const response = await request(app).get('/api/sponsors');
      if (response.body.length > 0) {
        const sponsor = response.body[0];
        expect(sponsor).toHaveProperty('id');
        expect(sponsor).toHaveProperty('name');
        expect(sponsor).toHaveProperty('email');
      }
    });
  });

  describe('GET /api/publishers', () => {
    it('returns an array of publishers', async () => {
      const response = await request(app).get('/api/publishers');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/ad-slots', () => {
    it('returns an array of ad slots', async () => {
      const response = await request(app).get('/api/ad-slots');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('ad slots have required fields', async () => {
      const response = await request(app).get('/api/ad-slots');
      if (response.body.length > 0) {
        const slot = response.body[0];
        expect(slot).toHaveProperty('id');
        expect(slot).toHaveProperty('name');
        expect(slot).toHaveProperty('type');
        expect(slot).toHaveProperty('basePrice');
        expect(slot).toHaveProperty('isAvailable');
      }
    });
  });

  describe('GET /api/campaigns', () => {
    it('requires authentication', async () => {
      const response = await request(app).get('/api/campaigns');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/newsletter/subscribe', () => {
    it('subscribes with valid email', async () => {
      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: 'test@example.com' });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('rejects invalid email', async () => {
      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: 'not-an-email' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });

    it('rejects missing email', async () => {
      const response = await request(app).post('/api/newsletter/subscribe').send({});
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/quotes/request', () => {
    it('creates a quote request with valid data', async () => {
      const response = await request(app).post('/api/quotes/request').send({
        email: 'quote@example.com',
        companyName: 'Test Corp',
        adSlotId: 'test-slot-id',
        message: 'Interested in your ad slot',
      });
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.quoteId).toBeTruthy();
    });

    it('rejects missing required fields', async () => {
      const response = await request(app)
        .post('/api/quotes/request')
        .send({ email: 'test@example.com' });
      expect(response.status).toBe(400);
    });
  });
});
