import userRoutes from '../routes/users/users.js';
import ruleRoutes from '../routes/rules/rules.js';
import apiKeyRoutes from '../routes/apiKeys/apiKeys.js';
import servicesRoutes from '../routes/microservices/microservices.js';
import { describe, expect, it } from 'vitest';

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
