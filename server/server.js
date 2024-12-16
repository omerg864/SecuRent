import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import path from 'path';
const config = dotenv.config();
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(mongoSanitize());

app.use(cookieParser());

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

// app.use('/api/name', name); use the route

//app.use(errorHandler);
