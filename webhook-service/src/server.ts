import express from 'express';
import os from "os";
import pool from './db/ms_db.js';
import swaggerUi from "swagger-ui-express";
import swaggerSpec from './config/swagger.js';

import eventsRoute from './routes/events/events.js';

const app = express();

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

app.listen(5000, () => {
  console.log("Webhook Service running on port 5000");
});
