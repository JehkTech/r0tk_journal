import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { body, validationResult } from 'express-validator';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    username: string;
  };
}

export const authenticateToken = (authService: AuthService) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const user = authService.verifyToken(token);
    if (!user) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    return next();
  };
};

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  return next();
};

// Validation rules
export const validateTrade = [
  body('pair').notEmpty().withMessage('Currency pair is required'),
  body('side').isIn(['Long', 'Short']).withMessage('Side must be Long or Short'),
  body('lot_size').isFloat({ min: 0.01 }).withMessage('Lot size must be a positive number'),
  body('entry_price').isFloat({ min: 0 }).withMessage('Entry price must be a positive number'),
  body('exit_price').optional().isFloat({ min: 0 }).withMessage('Exit price must be a positive number'),
  body('stop_loss').optional().isFloat({ min: 0 }).withMessage('Stop loss must be a positive number'),
  body('take_profit').optional().isFloat({ min: 0 }).withMessage('Take profit must be a positive number'),
  body('session').isIn(['Asian', 'London', 'NY', 'Overlap']).withMessage('Invalid session'),
  body('strategy').optional().isString().withMessage('Strategy must be a string'),
  body('emotion').optional().isIn(['Confident', 'Focused', 'Calm', 'Rushed', 'Uncertain', 'Fearful', 'Greedy']).withMessage('Invalid emotion'),
  body('confidence').optional().isInt({ min: 1, max: 10 }).withMessage('Confidence must be between 1 and 10'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
  body('trade_date').isISO8601().withMessage('Trade date must be a valid date')
];

export const validateUser = [
  body('username').isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

export const validateLogin = [
  body('username').notEmpty().withMessage('Username or email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const validatePasswordChange = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
];
