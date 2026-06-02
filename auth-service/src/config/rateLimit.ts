import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  statusCode: 429,
  message: {
    error: 'To many requests from this ip, try again later.',
  },
  standardHeaders: true,
  legacyHeaders: true,
});

export default limiter;