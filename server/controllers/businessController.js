import asyncHandler from 'express-async-handler';
import Business from '../models/businessModel.js';
import Customer from '../models/customerModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { email_regex } from '../utils/regex.js';
import {
	generateBusinessAccessToken,
	generateBusinessRefreshToken,
} from '../utils/functions.js';
import { OAuth2Client } from 'google-auth-library';
import { sendEmail } from '../utils/functions.js';
import { verifyCompanyNumber } from '../utils/externalFunctions.js';

export const password_regex =
	/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Reusable login success function
const successFullLogin = async (res, business) => {
	const accessToken = generateBusinessAccessToken(business._id);
	const { refreshToken, unique } = generateBusinessRefreshToken(business._id);

	if (!business.refreshTokens) business.refreshTokens = [];
	business.refreshTokens.push({ token: refreshToken, unique });
	await business.save();

	res.status(200).json({
		success: true,
		accessToken,
		refreshToken,
		business,
	});
};

// Register
const registerBusiness = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		res.status(400);
		throw new Error('Please fill in all fields');
	}

	if (!email_regex.test(email)) {
		res.status(401);
		throw new Error('Invalid email format');
	}

	if (!password_regex.test(password)) {
		res.status(402);
		throw new Error('Password is not strong enough');
	}

	const businessExists = await Business.findOne({
		email: new RegExp(`^${email}$`, 'i'),
	});
	const customerExists = await Customer.findOne({
		email: new RegExp(`^${email}$`, 'i'),
	});

	if (businessExists || customerExists) {
		res.status(403);
		throw new Error('Email already in use');
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const business = await Business.create({
		name,
		email,
		password: hashedPassword,
	});

	const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
	const subject = 'Verify Your Email Address';
	const text = `Your verification code is: ${verificationCode}`;

	const html = `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
			<h2 style="color: #333;">Verify Your Email</h2>
			<p>Thank you for signing up. Please use the code below to verify your email address:</p>
			<div style="font-size: 24px; font-weight: bold; margin: 20px 0; color:rgb(76, 87, 175);">${verificationCode}</div>
			<p>If you didn't request this, please ignore this email.</p>
		</div>
	`;

	const sent = await sendEmail(email, subject, text, html);

	business.verificationCode = verificationCode;
	await business.save();

	res.status(201).json({
		success: true,
		sent,
		message: 'Business registered successfully',
	});
});

// Login
const loginBusiness = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400);
		throw new Error('Please fill in all fields');
	}

	const business = await Business.findOne({
		email: new RegExp(`^${email}$`, 'i'),
	});

	if (!business) {
		res.status(404);
		throw new Error('Invalid email or password');
	}

	const isMatch = await bcrypt.compare(password, business.password);
	if (!isMatch) {
		res.status(401);
		throw new Error('Invalid email or password');
	}

	await successFullLogin(res, business);
});

export {
	registerBusiness,
	loginBusiness,
};
