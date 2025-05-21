import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

/**
 * Extracts and verifies JWT from the Authorization header.
 * Returns the decoded payload or null if missing/invalid.
 */
export function getUserFromToken(req: Request): JwtPayload | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET_KEY || '';

  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
}

/**
 * Generates a signed JWT for the given user payload.
 */
export function signToken(user: JwtPayload): string {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };
  const secret = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secret, { expiresIn: '1h' });
}