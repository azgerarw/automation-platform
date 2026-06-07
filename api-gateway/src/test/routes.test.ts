import userRoutes from '../routes/users/users.js';
import ruleRoutes from '../routes/rules/rules.js';
import apiKeyRoutes from '../routes/apiKeys/apiKeys.js';
import servicesRoutes from '../routes/microservices/microservices.js';
import { describe, test, expect, it } from 'vitest';

describe('API Gateway routers', () => {
  it('exports valid Express routers', () => {
    [userRoutes, ruleRoutes, apiKeyRoutes, servicesRoutes].forEach((router) => {
      expect(router).toBeDefined();
      expect(typeof router).toBe('function');
      expect(typeof router.use).toBe('function');
      expect('stack' in router).toBe(true);
    });
  });
});


describe('User API', () => {
  const number = Math.floor(Math.random() * 10000);
  it('POST /users/register - create user', async () => {
    const res = await fetch('http://localhost:3000/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: `Guest${number}`, email: `guest${number}@example.com`, password: 'Password123.', role: 'user' })
    });

    
    const data = await res.json();
    
    expect(data.userServiceResponse.message).toBe('User created');
    expect(data.status).toBe('user data sent for registration');
    expect(data.userServiceResponse.status).toBe(201);
  });

});



