import express, { Router } from 'express';
import verifyToken from '../../config/verifyToken.js';
import authMiddleware from '../../config/authMiddleware.js';

const router = express.Router();


/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: login request
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
 *         description: loging in
 *       500:
 *         description: internal server error
 */

router.post("/login", async (req, res) => {

  const payload = req.body

  try {

    const response = await fetch("http://auth-service:4000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: payload.email, password: payload.password }),
    });

    const data = await response.json();

    res.cookie("refreshToken", data.rt, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000
    });

    res.cookie("Token", data.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000
    });

    res.cookie("User_id", data.user_id, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000
    });
    
    res.cookie("User_role", data.role, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000
    });

    return res.json({
      service: "api-gateway",
      status: "user data sent for authorization",
      authServiceResponse: data
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      service: "api-gateway",
      error: "data not sent",
      status: "rejected"
    });
  }
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Create user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: request sent to user-service
 *       500:
 *         description: internal server error
 */

router.post("/register", async (req, res) => {

  const payload = req.body

  try {

    const response = await fetch("http://user-service:9000/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: payload.username, email: payload.email, password: payload.password, role: 'user' }),
    });

    const data = await response.json();

    return res.json({
      service: "api-gateway",
      status: "user data sent for registration",
      userServiceResponse: data
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      service: "api-gateway",
      error: "data not sent",
      status: "rejected"
    });
  }
});

/**
 * @swagger
 * /users/validateUser:
 *   post:
 *     summary: Validate user token
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
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 userId:
 *                   type: string
 *                   example: "123"
 *       401:
 *         description: Token missing
 *       403:
 *         description: Invalid token
 */

router.post("/validateUser", async (req, res) => {

    const token = req.headers.authorization?.split(" ")[1];
    const rtoken = req.body.refreshToken

    if (!token) {
        return res.status(401).json({ message: "Token is missing" });
    }

    const validToken = verifyToken(token);

    if (validToken.error == 'TOKEN_EXPIRED'){

      const response = await fetch("http://auth-service:4000/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: rtoken }),
      });

      const data = await response.json();

      return res.json({ message: 'token refreshed', newToken: data})
    }

    return res.json({ message: validToken });
    

})

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: logout request
 *     responses:
 *       200:
 *         description: logged out successfully
 *       500:
 *         description: internal server error
 */

router.post("/logout", async (req, res) => {
  try {
    const response = await fetch("http://auth-service:4000/users/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.cookie || "",
      },
    });

    if (!response.ok) {
      throw new Error("Auth service failed");
    }

    res.clearCookie("Token");
    res.clearCookie("refreshToken");
    res.clearCookie("User_id");

    return res.json({
      status: "user logged out"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "logout failed"
    });
  }
});

/**
 * @swagger
 * /users/check-session:
 *   post:
 *     summary: Check if user session is active
 *     tags:
 *       - Auth
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
 *         description: session active
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: boolean
 *                   example: true
 *                 user_id:
 *                   type: string
 *                   example: "123"
 *       401:
 *         description: no active session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: no session
 *       500:
 *         description: Error interno del servidor
 */

router.post("/check-session", async (req, res) => {
    try {
      const token = req.cookies.Token;
      const refreshToken = req.cookies.refreshToken;
      const userId = req.cookies.User_id;
      const userRole = req.cookies.User_role;

      if (!token) {
        return res.status(401).json({
          status: "no session",
        });
      }

      return res.json({
        token: true,
        user_id: userId,
        user_role: userRole
      });

    } catch (error) {
      console.error(error);

    return res.status(500).json({
      error: "session check failed",
    });
  }
});

router.patch("/alerts/toggle", authMiddleware, async (req, res) => {

  const user_id = req.cookies.User_id;
  const newAlert = req.body.newAlert;

  try {
    const response = await fetch(`http://user-service:9000/alerts/toggle`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ newAlert, user_id })
    });

    const data = await response.json();

    return res.json({
      service: "api-gateway",
      status: "alert status toggled",
      alertStatus: data.newStatus
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      service: "api-gateway",
      error: "failed to toggle alert status",
      status: "rejected"
    });
  }
})

router.get("/alerts/fetchStatus", authMiddleware, async (req, res) => {

  const user_id = req.cookies.User_id;

  try {
    const response = await fetch(`http://user-service:9000/alerts/fetchStatus/${user_id}`, {
      method: "GET"
    });

    const data = await response.json();

    return res.json({
      service: "api-gateway",
      status: "alert status fetched",
      alertStatus: data.alertStatus
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      service: "api-gateway",
      error: "failed to fetch alert status",
      status: "rejected"
    });
  }
})

router.get("/list", authMiddleware, async (req, res) => {

  try {
    const response = await fetch(`http://user-service:9000/users/list`, {
      method: "GET"
    });

    if (!response.ok) {
      throw new Error("User service failed");
    }
    const data = await response.json();

    return res.json({
      service: "api-gateway",
      status: "users fetched",
      userServiceResponse: data.users
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      service: "api-gateway",
      error: "failed to fetch users",
      status: "rejected"
    });
  }
})

export default router;