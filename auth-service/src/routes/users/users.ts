import express, { Router } from 'express';
import generateToken from '../../config/generateToken.js';
import bcrypt from 'bcrypt';
import limiter from '../../config/rateLimit.js';
import pool from '../../db/db.js';
import crypto from "crypto";

const router = express.Router();


/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: auth request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: authorizing
 */

router.post("/login", limiter, async (req, res) => {

  const { email, password } = req.body;

  try {
    
    const response = await fetch(
      `http://user-service:9000/users/${encodeURIComponent(email)}`
    );

    const data = await response.json();

    if (!data.user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, data.user.password);

    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const accessToken = generateToken(data.user.id);
    const refreshToken = crypto.randomUUID();
    
    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token) VALUES ($1,$2)",
      [data.user.id, refreshToken]
    );
    
    return res.json({
      service: "auth-service",
      token: accessToken,
      rt: refreshToken,
      user_id: data.user.id,
      role: data.user.role
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      service: "auth-service",
      error: "internal server error"
    });

  }

});

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged out
 *       403:
 *         description: invalid token
 */

router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    await pool.query(
      'DELETE FROM refresh_tokens WHERE token = $1',
      [refreshToken]
    );

    return res.json({ message: "Logout OK" });

  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

/**
 * @swagger
 * /users/refresh:
 *   post:
 *     summary: Refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: token refreshed
 *       403:
 *         description: Invalid refresh token
 */

router.post("/refresh", async (req, res) => {

  const { refreshToken } = req.body;

  const tokenRecord = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token=$1",
    [refreshToken]
  );

  if (!tokenRecord.rows.length) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const userId = tokenRecord.rows[0].user_id;

  const newAccessToken = generateToken(userId);

  return res.json({ accessToken: newAccessToken, user_id: userId });

});



export default router;