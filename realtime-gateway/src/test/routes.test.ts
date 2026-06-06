import assert from 'node:assert';
import executionsRoute from '../routes/executions.js';
import eventsRoute from '../routes/events.js';
import { describe, expect, it } from 'vitest';

describe('Realtime Gateway routers', () => {
  it('exports valid Express routers', () => {
    [executionsRoute, eventsRoute].forEach((router) => {
      expect(router).toBeDefined();
      expect(typeof router).toBe('function');
      expect(typeof router.use).toBe('function');
      expect('stack' in router).toBe(true);
    });
  });
});
