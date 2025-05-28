import jwt from 'jsonwebtoken';

interface JwtPayload { _id: string; username: string; email: string; }

/**
 * Extracts and verifies JWT from any incoming request object.
 */
export function getUserFromToken(req: any): JwtPayload | null {
  const authHeader = req.headers?.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY || '') as JwtPayload;
  } catch {
    return null;
  }
}
