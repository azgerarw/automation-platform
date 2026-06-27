import express from 'express';
import swaggerUi from "swagger-ui-express";
import swaggerSpec from './config/swagger.js';
import usersRoute from './routes/users/users.js';
import apiKeysRoute from './routes/apiKeys/apiKeys.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import os from "os";
import ms_pool from './db/ms.js';
import pClient from 'prom-client';
import { logger } from './config/logger.js';

const app = express();
const register = new pClient.Registry();
pClient.collectDefaultMetrics({ register });
app.use(express.json());
app.use(cookieParser());
app.disable("x-powered-by");

// Security headers with proper CSP
app.use(helmet({
  contentSecurityPolicy: false
}));

// Permissions-Policy header
app.use((_req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=(), display-capture=(), document-domain=(), fullscreen=(self)"
  );
  next();
});

// service metrics
let lastRequestAt: Date | null = null;
let totalRequests = 0;

app.use((req, res, next) => {
  totalRequests++;
  lastRequestAt = new Date();

  const start = Date.now();

  res.on("finish", () => {

    logger.info({
      event: "HTTP_REQUEST",
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      ip: req.ip,
      durationMs: Date.now() - start,
      userAgent: req.headers["user-agent"]
    });

  });

  next();
});

setInterval(async () => {

  const memory = process.memoryUsage();

  const uptimeMinutes = process.uptime() / 60;

  const requestsPerMinute =
    uptimeMinutes > 0
      ? totalRequests / uptimeMinutes
      : totalRequests;

  console.log('updating server metrics')
  await ms_pool.query(`
    UPDATE microservices
    SET
      cpu_usage = $1,
      memory_usage_mb = $2,
      uptime_seconds = $3,
      heapused = $4,
      heaptotal = $5,
      last_request_at = $6,
      updated_at = $7,
      last_heartbeat = $8,
      total_requests = $9,
      requests_per_min = $10,
      pid = $11,
      platform = $12,
      version = $13,
      rss = $14

    WHERE service_name = 'auth-service'
  `, [
    os.loadavg()[0],
    memory.rss / 1024 / 1024,
    Math.floor(process.uptime()),
    memory.heapUsed,
    memory.heapTotal,
    lastRequestAt,
    lastRequestAt,
    lastRequestAt,
    totalRequests,
    requestsPerMinute,
    process.pid,
    process.platform,
    process.version,
    memory.rss
  ]);

}, 10000);


if (process.env.NODE_ENV !== 'production') {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/openapi.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.send(swaggerSpec);
  });
}

/**
 * @swagger
 * /health:
 *   get:
 *     summary: health check
 *     responses:
 *       200:
 *         description: checked connection
 */

app.get("/health", (req, res) => {
  res.json({ service: "auth-service", status: "ok" });
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.use("/users", usersRoute);
app.use("/apiKeys", apiKeysRoute);

// Catch-all route for undefined paths
app.use((_req, res) => {
  res.status(404).json({
    error: "Not found",
    message: "The requested endpoint does not exist"
  });
});


// Global error handler to prevent info leakage
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({
    error: "Internal server error",
    message: "An unexpected error occurred"
  });
});

app.listen(4000, () => {
  console.log("Auth Service running on port 4000");
});