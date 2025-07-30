import express from 'express';
import {
  createPayment,
  getMyPayments,
  getAllPayments,
  updatePayment,
  deletePayment
} from '../../controllers/paymentController.js';
import { protect, adminOnly } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createPayment)
  .get(protect, getMyPayments);

router.route('/admin')
  .get(protect, adminOnly, getAllPayments);

router.route('/:id')
  .put(protect, updatePayment)
  .delete(protect, deletePayment);

export default router;