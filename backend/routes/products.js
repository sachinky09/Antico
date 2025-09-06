import express from 'express';
import { 
  getProducts, 
  createProduct, 
  getProductInterests, 
  getSoldProducts 
} from '../controllers/productController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getProducts);
router.post('/', authenticateToken, requireAdmin, createProduct);
router.get('/sold', authenticateToken, requireAdmin, getSoldProducts);
router.get('/:id/interests', authenticateToken, requireAdmin, getProductInterests);

export default router;