import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorMiddleware.js';
import rateLimiterMiddleware from './middleware/rateLimiterMiddleware.js';
import adminRoutes from './routes/adminRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import notificationsRoutes from './routes/notificationsRoutes.js';
import cors from 'cors';
import http from 'http';
import { setUpWebSocket } from './config/websocket.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

const server = http.createServer(app);

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
		server.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`.green.bold);
			setUpWebSocket(server);
		});
	}
});

// Routes setup
app.use('/api/admin', adminRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/item', itemRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/notifications', notificationsRoutes);

// Error handler middleware should be last
app.use(errorHandler);
