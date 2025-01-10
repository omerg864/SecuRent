import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import path from 'path';
const config = dotenv.config();
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorMiddleware.js';
import rateLimiterMiddleware from './middleware/rateLimiterMiddleware.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(mongoSanitize());

app.use(cookieParser());
app.use(rateLimiterMiddleware);

connectDB(() => {
	if (process.env.NODE_ENV !== 'test') {
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	}
});

app.use(errorHandler);
