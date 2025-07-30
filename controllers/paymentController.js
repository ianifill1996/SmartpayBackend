import Payment from '../models/Payment.js';

export const createPayment = async (req, res) => {
  const { amount, method, reason, category } = req.body;
  const payment = await Payment.create({
    user: req.user._id,
    amount,
    method,
    reason,
    category
  });
  res.status(201).json(payment);
};

export const getMyPayments = async (req, res) => {
  const payments = await Payment.find({ user: req.user._id });
  res.json(payments);
};

export const getAllPayments = async (req, res) => {
  const payments = await Payment.find().populate('user', 'name email');
  res.json(payments);
};