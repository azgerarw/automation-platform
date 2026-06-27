import express from 'express';
import helmet from 'helmet';
import os from "os";
import pool from './db/ms_db.js';
import swaggerUi from "swagger-ui-express";
import swaggerSpec from './config/swagger.js';
import pClient from 'prom-client';
import eventsRoute from './routes/events/events.js';

const app = express();
const register = new pClient.Registry();
pClient.collectDefaultMetrics({ register });

app.use(express.json());

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

if (process.env.NODE_ENV !== 'production') {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/openapi.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.send(swaggerSpec);
  });
}


app.disable("x-powered-by");
// service metrics
let lastRequestAt: Date | null = null;
let totalRequests = 0;

app.use((req, res, next) => {
  totalRequests++;
  lastRequestAt = new Date();
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
  await pool.query(`
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
      rss = $12

    WHERE service_name = 'webhook-service'
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
    memory.rss
  ]);

}, 10000);


app.use("/events", eventsRoute);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: health check
 *     responses:
 *       200:
 *         description: checked connection
 */

app.get("/health", async (req, res) => {
  res.json({ service: "webhook-service", status: "ok" });
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

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

app.listen(5000, () => {
  console.log("Webhook Service running on port 5000");
});