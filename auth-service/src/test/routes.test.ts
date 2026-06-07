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

describe('User API', () => {

  it('POST /health - health check', async () => {
    const res = await fetch('http://localhost:4000/health', {
      method: 'GET',
      });

    
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe('ok');
  });

});