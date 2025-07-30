import express from 'express';
import { createPayment, getMyPayments, getAllPayments } from '../../controllers/paymentController.js';
import { protect, adminOnly } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createPayment)
  .get(protect, getMyPayments);

router.route('/admin')
  .get(protect, adminOnly, getAllPayments);

export default router;
