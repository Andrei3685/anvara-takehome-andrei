import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './index.js';
import {
  getParam,
  formatCurrency,
  calculatePercentChange,
  parsePagination,
  isValidEmail,
  buildFilters,
  clampValue,
  formatDate,
} from './utils/helpers.js';

// ─── Utility Function Tests ────────────────────────────────────────────────────

describe('Utility Functions', () => {
  describe('getParam', () => {
    it('returns a string directly', () => {
      expect(getParam('abc')).toBe('abc');
    });

    it('returns first element of string array', () => {
      expect(getParam(['first', 'second'])).toBe('first');
    });

    it('returns empty string for undefined', () => {
      expect(getParam(undefined)).toBe('');
    });
    it('returns empty string for number', () => {
      expect(getParam(123)).toBe('');
    });
  });

  describe('formatCurrency', () => {
    it('formats USD by default', () => {
      expect(formatCurrency(1234.5)).toBe('$1,234.50');
    });

    it('formats zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('formats negative values', () => {
      expect(formatCurrency(-99.99)).toBe('-$99.99');
    });
  });

  describe('calculatePercentChange', () => {
    it('calculates positive change', () => {
      expect(calculatePercentChange(100, 150)).toBe(50);
    });

    it('calculates negative change', () => {
      expect(calculatePercentChange(200, 100)).toBe(-50);
    });

    it('handles zero old value with positive new value', () => {      expect(calculatePercentChange(0, 50)).toBe(100);
    });

    it('handles zero to zero', () => {
      expect(calculatePercentChange(0, 0)).toBe(0);
    });
  });

  describe('parsePagination', () => {
    it('returns defaults when no params', () => {
      const result = parsePagination({});
      expect(result).toEqual({ page: 1, limit: 10, skip: 0 });
    });

    it('calculates skip correctly', () => {
      const result = parsePagination({ page: '3', limit: '20' });
      expect(result).toEqual({ page: 3, limit: 20, skip: 40 });
    });

    it('handles invalid values gracefully', () => {
      const result = parsePagination({ page: 'abc', limit: 'xyz' });
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });

  describe('isValidEmail', () => {
    it('accepts valid email', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
    });
    it('rejects email without @', () => {
      expect(isValidEmail('userexample.com')).toBe(false);
    });

    it('rejects email without domain', () => {
      expect(isValidEmail('user@')).toBe(false);
    });

    it('rejects empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('buildFilters', () => {
    it('picks only allowed fields', () => {
      const query = { name: 'test', secret: 'hidden', type: 'DISPLAY' };
      const result = buildFilters(query, ['name', 'type']);
      expect(result).toEqual({ name: 'test', type: 'DISPLAY' });
    });

    it('ignores undefined fields', () => {
      const query = { name: 'test' };
      const result = buildFilters(query, ['name', 'type']);
      expect(result).toEqual({ name: 'test' });
    });
  });

  describe('clampValue', () => {
    it('clamps below min', () => {      expect(clampValue(-5, 0, 100)).toBe(0);
    });

    it('clamps above max', () => {
      expect(clampValue(200, 0, 100)).toBe(100);
    });

    it('returns value within range', () => {
      expect(clampValue(50, 0, 100)).toBe(50);
    });
  });

  describe('formatDate', () => {
    it('formats a valid date string', () => {
      const result = formatDate('2026-01-15');
      expect(result).toBeTruthy();
      expect(result).not.toBe('Invalid date');
    });

    it('returns Invalid date for bad input', () => {
      expect(formatDate('not-a-date')).toBe('Invalid date');
    });
  });
});

describe('API Endpoints', () => {
  describe('GET /api/health', () => {
    it('returns health status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);      expect(response.body.status).toBe('ok');
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
    it('subscribes with valid email', async () => {      const response = await request(app)
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
      });      expect(response.status).toBe(201);
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
