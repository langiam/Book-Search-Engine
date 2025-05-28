import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
// Express middleware for your REST routes
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.sendStatus(401);
        return;
    }
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || '';
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        // @ts-ignore
        req.user = user;
        next();
    });
};
// Helper for GraphQL and for signing tokens
export function signToken(user) {
    const payload = {
        _id: String(user._id),
        username: user.username,
        email: user.email,
    };
    const secretKey = process.env.JWT_SECRET_KEY || '';
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}
