// server/src/services/auth.ts
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { JwtPayload } from '../utils/auth.js';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_secret_key';
const EXPIRATION = '1h';

/**
 * Signs a JWT for the given user payload.
 * @param user An object containing at least {_id, username, email}
 */
export function signToken(user: JwtPayload): string {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRATION });
}
