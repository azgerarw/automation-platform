import App from '../App.tsx';
import { describe, expect, it } from 'vitest';

describe('Frontend App', () => {
  it('exports the App component', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });
});
