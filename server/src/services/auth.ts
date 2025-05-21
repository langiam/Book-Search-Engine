
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { JwtPayload } from '../util/util';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'YOUR_SECRET_KEY';
const EXPIRATION = '1h';

/**
 * Generate a signed JWT for the given user payload.
 * @param user An object containing {_id, username, email}
 */
export function signToken(user: JwtPayload): string {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRATION });
}