import eventsRoute from '../routes/events/events.js';
import { describe, expect, it } from 'vitest';

describe('Webhook service routers', () => {
  it('exports valid Express routers', () => {
    [eventsRoute].forEach((router) => {
      expect(router).toBeDefined();
      expect(typeof router).toBe('function');
      expect(typeof router.use).toBe('function');
      expect('stack' in router).toBe(true);
    });
  });
});
