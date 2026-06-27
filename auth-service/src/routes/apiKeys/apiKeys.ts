import express, { Router } from 'express';
import bcrypt from 'bcrypt';
import pool from '../../db/db.js';
import crypto from "crypto";

const router = express.Router();

/**
 * @swagger
 * /apiKeys/generate-apikey:
 *   post:
 *     summary: Generate API key
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       201:
 *         description: API key generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                 secret:
 *                   type: string
 *       400:
 *         description: Missing user_id
 */

router.post("/generate-apikey", async (req, res) => {

    const user_id = req.headers["x-user-id"] as string;

    if (!user_id) {
    return res.status(400).json({ message: "Missing user_id" });
    }

    try {

    const apiKey = crypto.randomBytes(16).toString("hex");

    const secret = crypto.randomBytes(32).toString("hex");
    const hashed = await bcrypt.hash(secret, 10)

    await pool.query(
    "INSERT INTO api_keys (user_id, api_key, secret) VALUES ($1,$2,$3)",
    [user_id, apiKey, hashed]
    );

    return res.status(201).json({ apiKey: apiKey, secret: secret });

    }

    catch(e) {
    return res.status(500).json({ message: "internal server error"})
    }

});

/**
 * @swagger
 * /apiKeys/verify-apikey:
 *   post:
 *     summary: Verify API key
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: API key
 *       - in: header
 *         name: x-secret
 *         required: true
 *         schema:
 *           type: string
 *         description: API secret
 *     responses:
 *       200:
 *         description: Credentials valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user_id:
 *                   type: string
 *       403:
 *         description: Invalid credentials
 */

router.post("/verify-apikey", async (req, res) => {

    const apiKey = req.headers["x-api-key"] as string;
    const secret = req.headers["x-secret"] as string;

    if (!apiKey || !secret) {
    return res.status(400).json({ message: "Missing credentials" });
    }

    try {

    const record = await pool.query(
    "SELECT * FROM api_keys WHERE api_key=$1",
    [apiKey]  );

    if (!record.rows.length) {
    return res.status(403).json({ message: "Invalid credentials" });
    }

    await pool.query(
    "UPDATE api_keys SET last_used = NOW() WHERE api_key=$1",
    [apiKey]
    );

    await pool.query(
    "UPDATE api_keys SET usage = usage + 1 WHERE api_key=$1",
    [apiKey]
    );

    const match = await bcrypt.compare(secret, record.rows[0].secret);

    if (!match) {
    return res.status(403).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ message: "Credentials valid", user_id: record.rows[0].user_id });

    }

    catch(e) {
    return res.status(500).json({ message: "internal server error"})
    }

});

/**
 * @swagger
 * /apiKeys/list:
 *   get:
 *     summary: List API keys for a user
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       200:
 *         description: API keys fetched successfully
 */

router.get("/list", async (req, res) => {

    const user_id = req.headers["x-user-id"] as string;

    try {
        const apiKeys = await pool.query(
        "SELECT * FROM api_keys WHERE user_id = $1",
        [user_id]
        );
        
        res.status(200).json({
            service: 'auth-service',
            aKeys: apiKeys.rows
        })
    } catch(e) {
        res.status(500).json({
            service: 'auth-service',
            error: "internal server error"
        })
    }
});

/**
 * @swagger
 * /apiKeys/delete/{apiKeyId}:
 *   delete:
 *     summary: Delete an API key
 *     parameters:
 *       - in: path
 *         name: apiKeyId
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-user-
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       200:
 *         description: API key deleted successfully
 */

router.get("/delete/:apiKeyId", async (req, res) => {

    try {
        const result = await pool.query(
        "DELETE FROM api_keys WHERE api_key_id = $1 AND user_id = $2 RETURNING api_key_id",
        [req.params.apiKeyId, req.headers["x-user-id"]]
        );
        
        result.rowCount === 0 ? res.status(404).json({
            service: 'auth-service',
            message: 'API key not found or not deleted'
        }) :

        res.status(200).json({
            service: 'auth-service',
            message: `API key ${result.rows[0].api_key_id} deleted successfully`
        })

    }catch(e){
        res.status(500).json(
            {
                "error": "internal server error"
            }
        )
    }

})

export default router;