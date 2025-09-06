import express from 'express';
import { markInterest } from '../controllers/interestController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, markInterest);

export default router;