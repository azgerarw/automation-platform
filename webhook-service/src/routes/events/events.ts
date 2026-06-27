import express from 'express';
import client from '../../db/red_db.js';
import { v4 as uuid } from 'uuid';
import pool from '../../db/psql_db.js';
import Execution from '../../models/execution.js';

const router = express.Router();

async function bootstrap() {
  await client.connect();
}

/**
 * @swagger
 * /events/publish:
 *   post:
 *     summary: Publish an event to the automation system
 *     description: >
 *       Receives an event and payload, validates API credentials,
 *       creates an execution record, and publishes the event to Redis.
 *     tags:
 *       - Webhooks
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: User API key
 *       - in: header
 *         name: x-secret
 *         required: true
 *         schema:
 *           type: string
 *         description: API secret associated with the API key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event
 *               - payload
 *             properties:
 *               event:
 *                 type: string
 *                 example: payment.succeeded
 *               payload:
 *                 type: object
 *                 example:
 *                   amount: 150
 *                   currency: USD
 *                   customer_id: cus_123456
 *     responses:
 *       200:
 *         description: Event successfully published
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authServiceResponse:
 *                   type: object
 *                   example:
 *                     user_id: user_123
 *                 webhookServiceResponse:
 *                   type: string
 *                   example: Event published
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing event or payload
 *       403:
 *         description: Invalid API credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 */

router.post("/publish", async (req, res) => {

    const apiKey = req.headers["x-api-key"] as string;
    const secret = req.headers["x-secret"] as string;

    const { event, payload, usersUser, message } = req.body;

    if (!event || !payload) {
        return res.status(400).json({
            error: "Missing event or payload"
        });
    }

    try {

        const response = await fetch("http://auth-service:4000/apiKeys/verify-apikey", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "x-secret": secret
            }
        });

        const data = await response.json();

        if (!data.user_id) {
            return res.status(403).json({ message: "Invalid credentials" });
        }

        const exec = new Execution()
        const activeExecution = await exec.activeExecution(data.user_id);

        let correlation_id;

        if (activeExecution.rows.length > 0) {
            
            correlation_id = activeExecution.rows[0].correlation_id;

            exec.updateLastEvent(correlation_id);
        } else {
            
            correlation_id = uuid();
        }

        const execution_id = uuid();

        exec.user_id = data.user_id;
        exec.payload = payload;
        exec.correlation_id = correlation_id;
        exec.status = "running";
        exec.execution_id = execution_id;

        await exec.create();

        await client.publish(
            "events_channel",
            JSON.stringify({
                event,
                payload,
                user_id: data.user_id,
                user: usersUser,
                msg: message,
                correlation_id,
                execution_id
            })
        );

        await client.publish(
            "executions_channel",
            JSON.stringify({
                message: "New execution created",
                execution_id
            })
        );

        return res.status(response.status).json({
            authServiceResponse: data,
            webhookServiceResponse: "Event published"
        });

    } catch (error) {

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});

router.get("/all", async (req, res) => {

        try {

            const eventsList = await pool.query(
            "SELECT * FROM events");

            return res.status(202).json({
                service: "webhook-service",
                events: eventsList.rows
            });
        } catch(error) {

            return res.status(500).json({
                error: "Internal server error",
                status: 500
            })
        }
    
});

router.get("/list/:user_id", async (req, res) => {

        try {

            const eventsList = await pool.query(
            "SELECT * FROM events WHERE user_id = $1",
            [req.params.user_id]
            );

            return res.status(202).json({
                service: "webhook-service",
                events: eventsList.rows
            });
        } catch(error) {

            return res.status(500).json({
                error: "Internal server error",
                status: 500
            })
        }
    
});


bootstrap();
export default router;