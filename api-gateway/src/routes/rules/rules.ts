import express, { Router } from 'express';
import authMiddleware from '../../config/authMiddleware.js';

const router = express.Router();

// RULES ENDPOINTS

/**
 * @swagger
 * /rules/create:
 *   post:
 *     summary: Create rule
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               rule:
 *                 type: json
 *     responses:
 *       201:
 *         description: Rule created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   example: 1
 *                 rule:
 *                   type: json
 *                   example: { "actions": [], "trigger": "", "conditions": ""}
 *       400:
 *         description: Bad request
 */

router.post("/create", authMiddleware, async (req, res) => {

    const payload = req.body


        try {

            const response = await fetch("http://rule-service:7000/rules/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: payload.user_id, rule: payload.rule }),
            });

            const data = await response.json();

            return res.status(response.status).json({
                service: "api-gateway",
                ruleServiceResponse: data
            });
        } catch(error) {

            return res.json({
                error: error,
                status: 500
            })
        }


        
    
});

/**
 * @swagger
 * /rules/update:
 *   post:
 *     summary: Update rule
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rule_id:
 *                 type: integer
 *               rule:
 *                 type: json
 *     responses:
 *       201:
 *         description: Rule updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rule_id:
 *                   type: integer
 *                   example: 1
 *                 rule:
 *                   type: json
 *                   example: { "actions": [], "trigger": "", "conditions": ""}
 *       400:
 *         description: Bad request
 */

router.patch("/update", authMiddleware, async (req, res) => {

  const payload = req.body


        try {

            const response = await fetch("http://rule-service:7000/rules/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rule_id: payload.rule_id, rule: payload.rule }),
            });

            const data = await response.json();

            return res.status(201).json({
                service: "api-gateway",
                status: "rule updated",
                ruleServiceResponse: data
            });
        } catch(error) {

            return res.json({
                error: error,
                status: 500
            })
        }
    
});

/**
 * @swagger
 * /rules/change-state:
 *   post:
 *     summary: Change state
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rule_id:
 *                 type: integer
 *               state:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Rule updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rule_id:
 *                   type: integer
 *                   example: 1
 *                 state:
 *                   type: string
 *                   example: True
 *       400:
 *         description: Bad request
 */

router.patch("/change-state", authMiddleware, async (req, res) => {

  const payload = req.body


        try {

            const response = await fetch("http://rule-service:7000/rules/change-state", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rule_id: payload.rule_id, state: payload.state }),
            });

            const data = await response.json();
            console.log(data)
            return res.status(201).json({
                service: "api-gateway",
                status: "state updated",
                ruleServiceResponse: data
            });
        } catch(error) {

            return res.json({
                error: error,
                status: 500
            })
        }
    
});

/**
 * @swagger
 * /rules/list/{user_id}:
 *   get:
 *     summary: list rules
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: user id
 *     responses:
 *       200:
 *         description: list rules
 */

router.get("/list/:user_id", authMiddleware, async (req, res) => {

        try {

            const response = await fetch(
                `http://rule-service:7000/rules/list/${req.params.user_id}`
            );

            const data = await response.json();

            return res.status(202).json({
                service: "api-gateway",
                status: "rules fetched",
                ruleServiceResponse: data
            });
        } catch(error) {

            return res.json({
                error: error,
                status: 500
            })
        }
    
});

/**
 * @swagger
 * /rules/delete/{rule_id}:
 *   get:
 *     summary: delete rule
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rule_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: rule id
 *     responses:
 *       200:
 *         description: rule deleted
 */

router.get("/delete/:rule_id", authMiddleware, async (req, res) => {


        try {

            const response = await fetch(
                `http://rule-service:7000/rules/delete/${req.params.rule_id}`
            );

            const data = await response.json();

            return res.status(202).json({
                service: "api-gateway",
                status: "rule deleted",
                ruleServiceResponse: data
            });
        } catch(error) {

            return res.json({
                error: error,
                status: 500
            })
        }
    
});

router.patch('/retryPolicy', authMiddleware, async (req, res) => {

    const { limit, rule_id } = req.body;

    try {
        const response = await fetch(`http://rule-service:7000/rules/retryPolicy`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ limit, rule_id }),
        });

        const data = await response.json();

        return res.status(200).json({
            service: "api-gateway",
            status: "updating retry policy",
            ruleServiceResponse: data
        });
    } catch (error) {
        return res.json({
            error: error,
            status: 500
        });
    }
});

router.patch("/globalRetry", authMiddleware, async (req, res) => {

    const { attempts, delay } = req.body;

    if(!attempts || !delay){
        return res.json({
            error: 'missing attempts or delay fields'
        })
    }

    try {
        const response = await fetch("http://rule-service:7000/rules/globalRetry", {
            method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    attempts: attempts,
                    delay: delay
                })
        })

        if(!response.ok){
            return res.status(response.status).json({
                error: 'error updating retry strategy',
                ruleServiceResponse: response
            })
        }

        const data = await response.json();
        
        res.status(200).json({
            service: 'api-gateway',
            ruleServiceResponse: data
        })
    }catch(e){
        res.status(500).json({
            error: String(e)
        })
    }
})

// EXECUTIONS ENDPOINTS

router.get("/executions/list", authMiddleware, async (req, res) => {

        console.log("Fetching executions...");
        const userId = req.cookies.User_id

        try {

            const response = await fetch(
                `http://execution-service:5500/executions/list/${userId}`
            );

            const data = await response.json();

            return res.status(202).json({
                service: "api-gateway",
                executionServiceResponse: data
            });
        } catch(error) {

            return res.json({
                error: error,
                status: 500
            })
        }
    
});

router.get("/executions/list/all", authMiddleware, async (req, res) => {

        console.log("Fetching executions...");
        const userId = req.cookies.User_id

        try {

            const response = await fetch(
                `http://execution-service:5500/executions/list/all`
            );

            const data = await response.json();

            return res.status(202).json({
                service: "api-gateway",
                executionServiceResponse: data
            });
        } catch(error) {

            return res.json({
                error: error,
                status: 500
            })
        }
    
});

router.get("/executions/byId/:e_id", authMiddleware, async (req, res) => {

        console.log("Fetching executions...");
        const userId = req.cookies.User_id
        const executionId = req.params.e_id

        try {

            const response = await fetch(
                `http://execution-service:5500/executions/byId/${executionId}`
            );

            const data = await response.json();

            return res.status(202).json({
                service: "api-gateway",
                executionServiceResponse: data.execution
            });
        } catch(error) {

            return res.json({
                error: error,
                status: 500
            })
        }
    
});

router.get("/executions/metrics", authMiddleware, async (req, res) => {

        console.log("Fetching metrics...");

        try {

            const response = await fetch(
                `http://execution-service:5500/executions/metrics`
            );

            const data = await response.json();

            return res.status(202).json({
                service: "api-gateway",
                executionServiceResponse: data.metrics
            });
        } catch(error) {

            return res.json({
                error: error,
                status: 500
            })
        }
    
});

router.get("/executions/queues", authMiddleware, async (req, res) => {

        console.log("Fetching queues...");

        try {

            const response = await fetch(
                `http://execution-service:5500/executions/queues`
            );

            if (!response.ok) {
                console.error("Failed to fetch queues, status:", response.status);
                return res.status(response.status).json({
                    error: "Failed to fetch queues",
                    status: response.status
                });
            }

            const data = await response.json();

            return res.status(202).json({
                service: "api-gateway",
                executionServiceResponse: data.queues
            });
        } catch(error) {

            return res.json({
                error: error,
                status: 500
            })
        }
    
});

// EVENTS ENDPOINTS

router.get("/events/list", authMiddleware, async (req, res) => {

        const userId = req.cookies.User_id

        try {

            const response = await fetch(
                `http://webhook-service:5000/events/list/${userId}`
            );

            const data = await response.json();

            return res.status(202).json({
                service: "api-gateway",
                webhookServiceResponse: data
            });
        } catch(error) {

            return res.json({
                error: error,
                status: 500
            })
        }
    
});

router.get("/events/all", authMiddleware, async (req, res) => {

        const userId = req.cookies.User_id

        try {

            const response = await fetch(
                `http://webhook-service:5000/events/all`
            );

            const data = await response.json();

            return res.status(202).json({
                service: "api-gateway",
                webhookServiceResponse: data.events
            });
        } catch(error) {

            return res.json({
                error: error,
                status: 500
            })
        }
    
});

export default router;