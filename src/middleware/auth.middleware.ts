import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    return;
  }

  try {
    // TODO: Verify token
    // const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    // req.user = await User.findById(decoded.id);
    
    // Mock implementation for now
    req.user = { _id: 'mock_user_id', role: 'farmer' }; 

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    return;
  }
};
