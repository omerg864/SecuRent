import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import path from 'path';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorMiddleware.js';
import rateLimiterMiddleware from './middleware/rateLimiterMiddleware.js';
import adminRoutes from './routes/adminRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import costumerRoutes from './routes/costumerRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import cors from 'cors';

const config = dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

// Enable CORS first
const corsOptions = {
  origin: '*', // or specify your frontend URL, e.g., 'http://localhost:19006'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions)); // Enable CORS with the specified options

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(mongoSanitize());
app.use(cookieParser());
app.use(rateLimiterMiddleware);

// Database connection
connectDB(() => {
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`.green.bold);
    });
  }
});

// Routes setup
app.use('/admin', adminRoutes);
app.use('/transaction', transactionRoutes);
app.use('/api/costumer', costumerRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/review', reviewRoutes);

// Error handler middleware should be last
app.use(errorHandler);
