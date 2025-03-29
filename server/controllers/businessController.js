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
	/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//Reusable login success function
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

//Register
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

	const verificationCode = Math.floor(
		100000 + Math.random() * 900000
	).toString();
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

const verifyEmail = asyncHandler(async (req, res) => {
	const { code } = req.body;
	const business = await Business.findById(req.business._id);

	if (!business) {
		res.status(404);
		throw new Error('Business not found');
	}

	if (code !== business.verificationCode) {
		res.status(401);
		throw new Error('Invalid verification code');
	}

	business.isEmailValid = true;
	if (business.isCompanyNumberVerified && business.isBankValid === true) {
		business.isValid = true;
	}
	await business.save();

	res.status(200).json({
		success: true,
		valid: business.isValid,
		message: 'Email verified successfully',
	});
});

//Login
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

//Refresh Token
const refreshTokens = asyncHandler(async (req, res) => {
	const { refreshToken } = req.body;
	if (!refreshToken) {
		res.status(400);
		throw new Error('Refresh token is required');
	}

	let decoded;
	try {
		decoded = jwt.verify(
			refreshToken,
			process.env.JWT_SECRET_REFRESH_BUSINESS
		);
	} catch (err) {
		throw new Error('Invalid or expired refresh token');
	}

	const business = await Business.findById(decoded.id);
	if (!business) {
		res.status(404);
		throw new Error('Business not found');
	}

	const storedToken = business.refreshTokens?.find(
		(t) => t.token === refreshToken
	);
	if (!storedToken) {
		res.status(403);
		throw new Error('Refresh token not recognized');
	}

	//Remove old token
	business.refreshTokens = business.refreshTokens.filter(
		(t) => t.token !== refreshToken
	);

	//Generate and save new token
	const accessToken = generateBusinessAccessToken(business._id);
	const { refreshToken: newRefreshToken, unique } =
		generateBusinessRefreshToken(business._id);
	business.refreshTokens.push({ token: newRefreshToken, unique });

	await business.save();

	res.status(200).json({
		success: true,
		accessToken,
		refreshToken: newRefreshToken,
	});
});

//Google Login
const googleLoginBusiness = asyncHandler(async (req, res) => {
	const client = new OAuth2Client(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		'postmessage'
	);
	const { code } = req.body;

	if (!code) {
		res.status(400);
		throw new Error('Invalid code');
	}

	const response = await client.getToken(code);
	const ticket = await client.verifyIdToken({
		idToken: response.tokens.id_token,
		audience: process.env.GOOGLE_CLIENT_ID,
	});

	const payload = ticket.getPayload();
	const email = payload?.email;

	if (!email) {
		res.status(401);
		throw new Error('Invalid email');
	}

	let business = await Business.findOne({
		email: new RegExp(`^${email}$`, 'i'),
	});

	if (!business) {
		business = await Business.create({
			name: payload?.name,
			email,
			Image: payload?.picture,
			phone: '',
			category: [],
			bank: {},
			address: '',
			currency: '',
			rating: 0,
		});
	}

	await successFullLogin(res, business);
});

//Update Business
const updateBusiness = asyncHandler(async (req, res) => {
	const {
		name,
		email,
		phone,
		category,
		bank,
		address,
		image,
		currency,
		rating,
	} = req.body;
	const business = await Business.findById(req.business._id);

	if (!business) {
		res.status(404);
		throw new Error('Business not found');
	}

	if (name) business.name = name;
	if (email && email_regex.test(email)) business.email = email;
	if (phone) business.phone = phone;
	if (category) business.category = category;
	if (bank) business.bank = bank;
	if (address) business.address = address;
	if (image) business.Image = image;
	if (currency) business.currency = currency;
	if (rating !== undefined) business.rating = rating;

	await business.save();

	return res.status(200).json({ success: true, business });
});

//Delete
const deleteBusiness = asyncHandler(async (req, res) => {
	const business = await Business.findById(req.business._id);
	if (!business) {
		return res.status(404).json({ message: 'Business not found' });
	}

	await business.deleteOne();
	res.status(200).json({
		success: true,
		message: 'Business account deleted successfully',
	});
});

//Get Business By ID
const getBusinessById = asyncHandler(async (req, res) => {
	const business = await Business.findById(req.params.id);
	if (!business) {
		return res.status(404).json({ message: 'Business not found' });
	}

	res.status(200).json({ success: true, business });
});

const verifyAndUpdateCompanyNumber = asyncHandler(async (req, res) => {
	const { companyNumber } = req.body;

	if (!companyNumber) {
		res.status(400);
		throw new Error('Company number is required');
	}
	const isBusiness = await Business.findOne({ companyNumber });
	if (isBusiness && isBusiness._id.toString() !== req.business._id.toString()) {
		res.status(401);
		throw new Error('Business already exists');
	}

	const verification = await verifyCompanyNumber(companyNumber);

	if (!verification) {
		res.status(402);
		throw new Error('Company number not found in official registry');
	}

	const business = await Business.findById(req.business._id);
	if (!business) {
		res.status(403);
		throw new Error('Business not found');
	}

	business.companyNumber = companyNumber;
	business.isCompanyNumberVerified = true;
	if (business.isEmailVerified && business.isBankValid === true) {
		business.isValid = true;
	}
	await business.save();

	res.status(200).json({
		success: true,
		valid: business.isValid,
		message: 'Company verified and updated successfully',
		company: verification,
	});
});

const verifyBank = asyncHandler(async (req, res) => {
	const { accountNumber, sortCode ,bankName, accountHolderName } = req.body;
	const business = await Business.findById(req.business._id);

	if (!business) {
		res.status(404);
		throw new Error('Business not found');
	}

	if (!accountNumber || !sortCode) {
		res.status(400);
		throw new Error('Account number and sort code are required');
	}
	if (!bankName || !accountHolderName) {
		res.status(401);
		throw new Error('Bank name and account holder name are required');

	}


	const bank = {
		accountNumber,
		sortCode,
		bankName,
		accountHolderName,
	};

	business.bank = bank;
	business.isBankValid = true;
	if (business.isEmailVerified && business.isCompanyNumberVerified) {
		business.isValid = true;
	}
	await business.save();

	res.status(200).json({
		success: true,
		valid: business.isValid,
		message: 'Bank verified and updated successfully',
		bank,
	});
});

export {
	registerBusiness,
	loginBusiness,
	refreshTokens,
	googleLoginBusiness,
	updateBusiness,
	deleteBusiness,
	getBusinessById,
	verifyAndUpdateCompanyNumber,
	verifyEmail,
	verifyBank,
};