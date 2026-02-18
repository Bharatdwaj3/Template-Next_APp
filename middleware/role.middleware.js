import jwt from "jsonwebtoken";
import { JWT_ACC_SECRECT } from "../config/env.config.js";

export const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {

    
    if (req.user && req.user.accountType) {
      req.role = req.user.accountType;
      if (allowedRoles.length && !allowedRoles.includes(req.role)) {
        return res.status(403).json({ message: 'Access denied insufficient role' });
      }
      return next();  
    }

    let token = null;

    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, JWT_ACC_SECRECT);
      req.user = decoded.user;
      req.role = req.user.accountType;

      if (allowedRoles.length && !allowedRoles.includes(req.user.accountType)) {
        return res.status(403).json({ message: 'Access denied insufficient role' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: 'Token not valid' });
    }
  };
};
