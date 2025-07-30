import express from 'express';
import { detectPaymentIntent } from '../../controllers/aiController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/intent', protect, detectPaymentIntent);

export default router;
