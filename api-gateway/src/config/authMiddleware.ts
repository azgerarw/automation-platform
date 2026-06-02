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

    const response = await fetch("http://auth-service:4000/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: rtoken }),
    });

    const data = await response.json();

    return res.status(401).json({
      message: 'token refreshed',
      newToken: data
    });
  }

  req.user = validToken.payload

  next();
};


export default authMiddleware;
