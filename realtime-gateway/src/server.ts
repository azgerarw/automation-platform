import express from 'express';
import executionsRoute from './routes/executions.js';
import eventsRoute from './routes/events.js';
import client from './db/red_db.js';
import { initSocket } from "./db/socket_io.js";
import http from "http";
await client.connect();
import os from "os";
import pool from './db/ms.js';

const app = express();

app.use(express.json());


app.use("/executions", executionsRoute);
app.use("/events", eventsRoute);

const server = http.createServer(app);

const io = initSocket(server);

io.on("connection", (socket: any) => {
    console.log(socket.id);

    socket.on("join", ({ userId }: { userId: string }) => {

        socket.join(`user:${userId}`);
        console.log(`Socket joined user:${userId}`);

        if (userId === "11") {
            socket.join("admins");
        }

    });
});

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

    WHERE service_name = 'realtime-gateway'
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

server.listen(4500, () => {
  console.log("Realtime Gateway running on port 4500");
});

export default io;