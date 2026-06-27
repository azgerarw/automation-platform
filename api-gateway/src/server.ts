import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerSpec from './config/swagger.js';
import userRoutes from './routes/users/users.js';
import ruleRoutes from './routes/rules/rules.js';
import apiKeyRoutes from './routes/apiKeys/apiKeys.js';
import servicesRoutes from './routes/microservices/microservices.js';
import cookieParser from "cookie-parser";
import os from "os";
import pool from './db/db.js';
import pClient from 'prom-client';

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

// Permissions-Policy header (separate from helmet for compatibility)
app.use((_req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=(), display-capture=(), document-domain=(), fullscreen=(self)"
  );
  next();
});

app.use(cors({
  origin: ['http://localhost:5173', 'https://ipinfo.io/json'],
  credentials: true
}));

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
      pid = $11

    WHERE service_name = 'api-gateway'
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
    process.pid
  ]);

}, 10000);

if (process.env.NODE_ENV !== 'production') {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Reduce information disclosure surface in production
const allowSwagger = process.env.NODE_ENV !== 'production';

if (allowSwagger) {
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
  res.json({ service: "api-gateway", status: "ok" });
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.get("/cookies", async (req, res) => {

  try {
    const response = await fetch('https://ipinfo.io/json');
    const data = await response.json();
    const ip = data?.ip ?? null;
    const country = data?.country ?? null;
    const city = data?.city ?? null;
    const timezone = data?.timezone ?? null;

    res.status(200).json({
      ip,
      country,
      city,
      timezone
    });
  } catch (error) {
    console.error("Error fetching IP info:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred"
    });
  }
});

app.use("/users", userRoutes);
app.use("/rules", ruleRoutes);
app.use("/apiKeys", apiKeyRoutes);
app.use("/microservices", servicesRoutes);

// Catch-all route for undefined paths - returns proper JSON instead of HTML/404
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

app.listen(3000, () => {
  console.log("API Gateway running on port 3000");
});