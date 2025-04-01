
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

interface JwtPayload {
  id: number
  email: string
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {

  const authHeader = req.headers['authorization']

  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: "Token not provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(403).json({ message: "Invalid or expired token" });
  }
}
