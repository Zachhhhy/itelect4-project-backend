import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";

export function protect(req: Request, res: Response, next: NextFunction): void {
  // 1. Check for Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Not authorized. No token provided." });
    return;
  }

  // 2. Extract the token
  const token = authHeader.split(" ")[1];

  try {
    // 3. Verify and decode
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // 4. Attach decoded payload to request so route handlers can use it
    req.user = decoded;

    next();
  } catch {
    res.status(401).json({ success: false, message: "Not authorized. Token is invalid or expired." });
  }
}
