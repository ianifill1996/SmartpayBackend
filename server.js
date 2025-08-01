import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/api/userRoutes.js';
import paymentRoutes from './routes/api/paymentRoutes.js';
import aiRoutes from './routes/api/aiRoutes.js';


dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));