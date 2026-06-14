import express from 'express';
import swaggerUi from "swagger-ui-express";
import swaggerSpec from './config/swagger.js';
import usersRoute from './routes/users/users.js';
import apiKeysRoute from './routes/apiKeys/apiKeys.js';
import cookieParser from 'cookie-parser';
import os from "os";
import ms_pool from './db/ms.js';
import pClient from 'prom-client';

const app = express();
const register = new pClient.Registry();
pClient.collectDefaultMetrics({ register });
app.use(express.json());
app.use(cookieParser());

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


app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

app.listen(4000, () => {
  console.log("Auth Service running on port 4000");
});
