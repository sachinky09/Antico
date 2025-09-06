import express from 'express';
import { placeBid } from '../controllers/biddingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, placeBid);

export default router;