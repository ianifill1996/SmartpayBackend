import express from 'express';
import { detectPaymentIntent, parseReceiptAI } from '../../controllers/aiController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// AI: Detect reason & category from description
router.post('/intent', protect, detectPaymentIntent);

// AI: Parse raw receipt text into structured payment info
router.post('/parse-receipt', protect, parseReceiptAI);

export default router;
