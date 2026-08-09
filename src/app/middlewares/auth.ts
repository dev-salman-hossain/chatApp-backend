import { NextFunction, Request, Response } from 'express';
import { jwtHelpers } from '../helpers/jwtHelpers.js';
import config from '../config/env.js';

// Extend Express Request type to hold user info
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('You are not authorized');
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new Error('You are not authorized');
      }
      const secret: string = String(config.jwt_access_token_secret || process.env.JWT_ACCESS_SECRET || 'access-secret');

      // Verify token
      const verifiedUser = jwtHelpers.verifyToken(token, secret);
      
      // Attach to req
      req.user = verifiedUser;
      
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Unauthorized Access' });
    }
  };
};

export default auth;