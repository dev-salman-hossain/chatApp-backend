import { jwtHelpers } from '../helpers/jwtHelpers.js';
import config from '../config/env.js';
const auth = () => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new Error('You are not authorized');
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
                throw new Error('You are not authorized');
            }
            const secret = String(config.jwt_access_token_secret || process.env.JWT_ACCESS_SECRET || 'access-secret');
            // Verify token
            const verifiedUser = jwtHelpers.verifyToken(token, secret);
            // Attach to req
            req.user = verifiedUser;
            next();
        }
        catch (error) {
            res.status(401).json({ success: false, message: 'Unauthorized Access' });
        }
    };
};
export default auth;
//# sourceMappingURL=auth.js.map