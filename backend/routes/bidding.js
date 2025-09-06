import express from 'express';
import { 
  startBidding, 
  placeBid, 
  getCurrentBidding, 
  endBidding 
} from '../controllers/biddingController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/start', authenticateToken, requireAdmin, startBidding);
router.post('/end', authenticateToken, requireAdmin, endBidding);
router.get('/current', authenticateToken, getCurrentBidding);

export default router;