import express from 'express';
import client from '../db/red_db.js';
import io from '../server.js';

const router = express.Router();

async function bootstrap() {
    
    await client.subscribe("executions_channel", (message) => {
    console.log("Received:", message);
    const parsed = JSON.parse(message);
    io.to(`user:${parsed.user_id}`).emit("execution_update", parsed);
    io.to(`admins`).emit("execution_update", parsed);
    });
}

bootstrap().catch(console.error);

export default router;
