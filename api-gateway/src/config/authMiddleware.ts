import verifyToken from './verifyToken.js';
import { Request, Response, NextFunction } from "express";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

  const token = req.headers.authorization?.split(" ")[1] || req.cookies.Token;

  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  const validToken = verifyToken(token);
  

  if (validToken.error === 'TOKEN_EXPIRED') {

    const rtoken = req.cookies.refreshToken;

    if (!rtoken) {
      return res.status(401).json({ error: "Refresh token missing" });
    }

    try {
      const response = await fetch("http://auth-service:4000/users/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ refreshToken: rtoken }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = { message: "token refresh failed" };
      }

      // Never leak upstream error payloads; return a consistent shape
      return res.status(401).json({
        message: 'token refreshed',
        newToken: (data && (data.accessToken ?? data.token ?? data.newToken)) ?? null
      });
    } catch (_error) {
      // Generic message to avoid info disclosure
      return res.status(502).json({
        error: "authentication service unavailable"
      });
    }
  }

  req.user = validToken.payload

  next();
};


export default authMiddleware;
