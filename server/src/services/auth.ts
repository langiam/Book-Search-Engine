// server/src/services/auth.ts
import type { Request, Response, NextFunction } from 'express';
import { getUserFromToken } from '../utils/auth.ts';

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Try to extract and verify the token
  const user = getUserFromToken(req);
  if (!user) {
    res.sendStatus(401);    // Unauthorized
    return;                 // <— return void here
  }

  // @ts-ignore
  req.user = user;
  next();                   // <— just call next(), don’t `return next()`
}
