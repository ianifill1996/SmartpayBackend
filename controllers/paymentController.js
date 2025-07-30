import Payment from '../models/Payment.js';

// @desc    Create a new payment
// @route   POST /api/payments
// @access  Private
export const createPayment = async (req, res) => {
  const { amount, method, description, category } = req.body;

  const payment = await Payment.create({
    user: req.user._id,
    amount,
    method,
    description,
    category,
  });

  res.status(201).json(payment);
};

// @desc    Get payments for logged-in user
// @route   GET /api/payments
// @access  Private
export const getMyPayments = async (req, res) => {
  const payments = await Payment.find({ user: req.user._id });
  res.json(payments);
};

// @desc    Get all payments (admin only)
// @route   GET /api/payments/admin
// @access  Private/Admin
export const getAllPayments = async (req, res) => {
  const payments = await Payment.find().populate('user', 'name email');
  res.json(payments);
};

// @desc    Update a payment
// @route   PUT /api/payments/:id
// @access  Private
export const updatePayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  if (payment.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized to update this payment' });
  }

  const { amount, description, method, category } = req.body;

  if (amount !== undefined) payment.amount = amount;
  if (description !== undefined) payment.description = description;
  if (method !== undefined) payment.method = method;
  if (category !== undefined) payment.category = category;

  const updated = await payment.save();
  res.json(updated);
};

// @desc    Delete a payment
// @route   DELETE /api/payments/:id
// @access  Private
export const deletePayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  if (payment.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized to delete this payment' });
  }

  await payment.remove();
  res.json({ message: 'Payment removed' });
};