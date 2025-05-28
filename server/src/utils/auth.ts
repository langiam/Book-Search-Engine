// server/src/utils/auth.ts
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  _id: unknown;      // allow unknown (ObjectId or string)
  username: string;
  email: string;
}

/**
 * Extracts and verifies a JWT from the Authorization header.
 * Returns the decoded payload or null if invalid/missing.
 */
export function getUserFromToken(req: Request): JwtPayload | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET_KEY || '';
  try {
    return jwt.verify(token, secretKey) as JwtPayload;
  } catch {
    return null;
  }
}
