// src/utils/auth.ts
import { Request } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload { _id: string; username: string; email: string; }

export function getUserFromToken(req: Request): JwtPayload | null {
  /* … */
}

export function signToken(user: JwtPayload): string {
  /* … */
}
