import usersRoute from '../routes/users/users.js';
import apiKeysRoute from '../routes/apiKeys/apiKeys.js';
import { describe, expect, it } from 'vitest';

describe('Auth Service routers', () => {
  it('exports valid Express routers', () => {
    [usersRoute, apiKeysRoute, ].forEach((router) => {
      expect(router).toBeDefined();
      expect(typeof router).toBe('function');
      expect(typeof router.use).toBe('function');
      expect('stack' in router).toBe(true);
    });
  });
});
