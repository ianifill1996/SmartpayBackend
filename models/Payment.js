import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  reason: { type: String },
  category: { type: String },
  date: {type: Date, default: Date.now},
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
