import { Router } from 'express';
import { AuthService } from '../services/AuthService';
import { TradeService } from '../services/TradeService';
import { authenticateToken, handleValidationErrors, validateUser, validateLogin, validatePasswordChange, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

export const createAuthRoutes = (authService: AuthService, tradeService: TradeService) => {
  // Register new user
  router.post('/register', validateUser, handleValidationErrors, async (req: any, res: any) => {
    try {
      const { username, email, password } = req.body;
      const user = await authService.register(username, email, password);
      
      // Remove password hash from response
      const { password_hash, ...userResponse } = user;
      res.status(201).json({ user: userResponse, message: 'User created successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create user' });
      }
    }
  });

  // Login user
  router.post('/login', validateLogin, handleValidationErrors, async (req: any, res: any) => {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      res.json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // Get current user profile
  router.get('/profile', authenticateToken(authService), async (req: AuthenticatedRequest, res: any) => {
    try {
      const user = await authService.getUserById(req.user!.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Remove password hash from response
      const { password_hash, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  // Update user profile
  router.put('/profile', authenticateToken(authService), async (req: AuthenticatedRequest, res: any) => {
    try {
      const { username, email } = req.body;
      const updateData: { username?: string; email?: string } = {};
      
      if (username) updateData.username = username;
      if (email) updateData.email = email;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      const user = await authService.updateUser(req.user!.userId, updateData);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // Change password
  router.put('/password', authenticateToken(authService), validatePasswordChange, handleValidationErrors, async (req: AuthenticatedRequest, res: any) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const success = await authService.changePassword(req.user!.userId, currentPassword, newPassword);
      
      if (!success) {
        return res.status(400).json({ error: 'Failed to change password' });
      }

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Password change error:', error);
      if (error instanceof Error && error.message.includes('incorrect')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to change password' });
      }
    }
  });

  // Get dashboard stats
  router.get('/dashboard', authenticateToken(authService), async (req: AuthenticatedRequest, res) => {
    try {
      const stats = await tradeService.getDashboardStats(req.user!.userId);
      res.json(stats);
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  });

  // Get analytics data
  router.get('/analytics', authenticateToken(authService), async (req: AuthenticatedRequest, res) => {
    try {
      const analytics = await tradeService.getAnalyticsData(req.user!.userId);
      res.json(analytics);
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
  });

  return router;
};
