import express, { Router } from 'express';
import authMiddleware from '../../config/authMiddleware.js';
import { Request, Response } from "express";

const router = express.Router();

/**
 * @swagger
 * /api-keys/generate:
 *   post:
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

            return res.json({
                service: "api-gateway",
                status: "api key generated",
                authServiceResponse: data
            });
        } catch(error) {

            return res.json({
                error: error,
                status: 500
            })
        }
   
});

router.get("/list", authMiddleware, async (req, res) => {

        const user_id = req.cookies.User_id;

        try {

            const response = await fetch(
                `http://auth-service:4000/apiKeys/list/${user_id}`
            );

            const data = await response.json();

            return res.status(202).json({
                service: "api-gateway",
                status: "apiKeys fetched",
                authServiceResponse: data
            });
        } catch(error) {

            return res.json({
                error: error,
                status: 500
            })
        }
    
});

router.get("/delete/:apiKeyId", authMiddleware, async (req, res) => {

    try {

            const response = await fetch(
                `http://auth-service:4000/apiKeys/delete/${req.params.apiKeyId}`
            );

            const data = await response.json();

            return res.status(202).json({
                service: "api-gateway",
                authServiceResponse: data
            });
        } catch(error) {

            return res.status(500).json({
                error: error
            })
    }

})
export default router;