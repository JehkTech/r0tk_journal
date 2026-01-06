import { Router } from 'express';
import { TradeService } from '../services/TradeService';
import { AuthService } from '../services/AuthService';
import { authenticateToken, handleValidationErrors, validateTrade, AuthenticatedRequest } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Low } from 'lowdb';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export const createTradeRoutes = (tradeService: TradeService, authService: AuthService, db: Low<any>) => {
  // Get all trades for authenticated user
  router.get('/', authenticateToken(authService), async (req: AuthenticatedRequest, res) => {
    try {
      const filters = {
        pair: req.query.pair as string,
        session: req.query.session as string,
        emotion: req.query.emotion as string,
        strategy: req.query.strategy as string,
        start_date: req.query.start_date as string,
        end_date: req.query.end_date as string,
        min_pnl: req.query.min_pnl ? parseFloat(req.query.min_pnl as string) : undefined,
        max_pnl: req.query.max_pnl ? parseFloat(req.query.max_pnl as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
      };

      const trades = await tradeService.getTrades(req.user!.userId, filters);
      res.json(trades);
    } catch (error) {
      console.error('Error fetching trades:', error);
      res.status(500).json({ error: 'Failed to fetch trades' });
    }
  });

  // Get single trade by ID
  router.get('/:id', authenticateToken(authService), async (req: AuthenticatedRequest, res: any) => {
    try {
      const tradeId = parseInt(req.params.id);
      if (isNaN(tradeId)) {
        return res.status(400).json({ error: 'Invalid trade ID' });
      }

      const trade = await tradeService.getTradeById(req.user!.userId, tradeId);
      if (!trade) {
        return res.status(404).json({ error: 'Trade not found' });
      }

      res.json(trade);
    } catch (error) {
      console.error('Error fetching trade:', error);
      res.status(500).json({ error: 'Failed to fetch trade' });
    }
  });

  // Create new trade
  router.post('/', authenticateToken(authService), validateTrade, handleValidationErrors, async (req: AuthenticatedRequest, res: any) => {
    try {
      const trade = await tradeService.createTrade(req.user!.userId, req.body);
      res.status(201).json(trade);
    } catch (error) {
      console.error('Error creating trade:', error);
      res.status(500).json({ error: 'Failed to create trade' });
    }
  });

  // Update trade
  router.put('/:id', authenticateToken(authService), validateTrade, handleValidationErrors, async (req: AuthenticatedRequest, res: any) => {
    try {
      const tradeId = parseInt(req.params.id);
      if (isNaN(tradeId)) {
        return res.status(400).json({ error: 'Invalid trade ID' });
      }

      const trade = await tradeService.updateTrade(req.user!.userId, { id: tradeId, ...req.body });
      if (!trade) {
        return res.status(404).json({ error: 'Trade not found' });
      }

      res.json(trade);
    } catch (error) {
      console.error('Error updating trade:', error);
      res.status(500).json({ error: 'Failed to update trade' });
    }
  });

  // Delete trade
  router.delete('/:id', authenticateToken(authService), async (req: AuthenticatedRequest, res: any) => {
    try {
      const tradeId = parseInt(req.params.id);
      if (isNaN(tradeId)) {
        return res.status(400).json({ error: 'Invalid trade ID' });
      }

      const deleted = await tradeService.deleteTrade(req.user!.userId, tradeId);
      if (!deleted) {
        return res.status(404).json({ error: 'Trade not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting trade:', error);
      res.status(500).json({ error: 'Failed to delete trade' });
    }
  });

  // Upload screenshots for a trade
  router.post('/:id/screenshots', authenticateToken(authService), upload.array('screenshots', 5), async (req: AuthenticatedRequest, res: any) => {
    try {
      const tradeId = parseInt(req.params.id);
      if (isNaN(tradeId)) {
        return res.status(400).json({ error: 'Invalid trade ID' });
      }

      // Verify trade exists and belongs to user
      const trade = await tradeService.getTradeById(req.user!.userId, tradeId);
      if (!trade) {
        return res.status(404).json({ error: 'Trade not found' });
      }

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      // Save screenshot records to database
      const screenshots = files.map(file => ({
        id: (db.data.screenshots.length > 0 ? Math.max(...db.data.screenshots.map((s: any) => s.id)) : 0) + 1,
        trade_id: tradeId,
        filename: file.filename,
        original_name: file.originalname,
        file_path: file.path,
        file_size: file.size,
        mime_type: file.mimetype,
        created_at: new Date().toISOString()
      }));

      db.data.screenshots.push(...screenshots);
      await db.write();

      res.status(201).json({ message: 'Screenshots uploaded successfully', count: files.length });
    } catch (error) {
      console.error('Error uploading screenshots:', error);
      res.status(500).json({ error: 'Failed to upload screenshots' });
    }
  });

  return router;
};