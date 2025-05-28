import * as jwt from 'jsonwebtoken';
/**
 * Extracts and verifies a JWT from the Authorization header.
 * Returns the decoded payload or null if invalid/missing.
 */
export function getUserFromToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return null;
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || '';
    try {
        return jwt.verify(token, secretKey);
    }
    catch {
        return null;
    }
}
