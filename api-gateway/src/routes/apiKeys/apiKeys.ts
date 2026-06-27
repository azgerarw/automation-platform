import express, { Router } from 'express';
import authMiddleware from '../../config/authMiddleware.js';
import { Request, Response } from "express";

const router = express.Router();

/**
 * @swagger
 * /apiKeys/generate:
 *   get:
 *     summary: Generate API key
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: API key generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 service:
 *                   type: string
 *                   example: "api-gateway"
 *                 status:
 *                   type: string
 *                   example: "api key generated"
 *                 authServiceResponse:
 *                   type: object
 *                   example: { "apiKey": "", "secret": "" }
 *       400:
 *         description: Missing user_id
 *       500:
 *         description: Internal server error
 */

router.get("/generate", authMiddleware, async (req: Request, res: Response) => {

    const user_id = req.cookies.User_id

    if (!user_id) {
    return res.status(400).json({ error: "User ID missing" });
    }

        try {

            const response = await fetch("http://auth-service:4000/apiKeys/generate-apikey", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": user_id
                }
            });

            const data = await response.json();

            return res.status(response.status).json({
                service: "api-gateway",
                status: "api key generated",
                authServiceResponse: data
            });
        } catch(error) {

            return res.status(502).json({
                error: "authentication service unavailable",
                status: 502
            })
        }
   
});

/**
 * @swagger
 * /apiKeys/list:
 *   get:
 *     summary: List API keys
 *     parameters:
 *       - in: cookie
 *         name: Token
 *         schema:
 *           type: string
 *         required: false
 *         description: User session token
 *       - in: cookie
 *         name: refreshToken
 *         schema:
 *           type: string
 *         required: false
 *         description: Refresh token
 *       - in: cookie
 *         name: User_id
 *         schema:
 *           type: string
 *         required: false
 *         description: user id
 *     responses:
 *       200:
 *         description: API keys fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 service:
 *                   type: string
 *                   example: "api-gateway"
 *                 status:
 *                   type: string
 *                   example: "apiKeys fetched"
 *                 authServiceResponse:
 *                   type: object
 *       502:
 *         description: authentication service unavailable
 */

router.get("/list", authMiddleware, async (req, res) => {

        const user_id = req.user.userId;

        try {

            const response = await fetch(
                `http://auth-service:4000/apiKeys/list`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-user-id": user_id.toString()
                    }
                }
            );

            const data = await response.json();

            return res.status(response.status).json({
                service: "api-gateway",
                status: "apiKeys fetched",
                authServiceResponse: data
            });
        } catch(error) {

            return res.status(502).json({
                error: "authentication service unavailable",
                status: 502
            })
        }
    
});

/**
 * @swagger
 * /apiKeys/delete/{apiKeyId}:
 *   get:
 *     summary: Delete an API key
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: cookie
 *         name: Token
 *         schema:
 *           type: string
 *         required: false
 *         description: User session token
 *       - in: cookie
 *         name: refreshToken
 *         schema:
 *           type: string
 *         required: false
 *         description: Refresh token
 *       - in: cookie
 *         name: User_id
 *         schema:
 *           type: string
 *         required: false
 *         description: user id
 *       - in: path
 *         name: apiKeyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API key deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 service:
 *                   type: string
 *                   example: "api-gateway"
 *                 authServiceResponse:
 *                   type: object
 *       502:
 *         description: authentication service unavailable
 */

router.get("/delete/:apiKeyId", authMiddleware, async (req, res) => {

    const user_id = req.user.user_id;

    try {

            const response = await fetch(
                `http://auth-service:4000/apiKeys/delete/${req.params.apiKeyId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-user-id": user_id.toString()
                    }
                }
            );

            const data = await response.json();

            return res.status(response.status).json({
                service: "api-gateway",
                authServiceResponse: data
            });
        } catch(error) {
            console.error(error);
            return res.status(502).json({
                error: "authentication service unavailable"
            })
    }

})
export default router;