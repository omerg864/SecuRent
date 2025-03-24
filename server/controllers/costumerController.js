import asyncHandler from 'express-async-handler';
import Costumer from '../models/costumerModel.js';
import Business from '../models/businessModel.js';
import bcrypt from 'bcrypt';
import { email_regex } from '../utils/regex.js';
import {
	generateCustomerAccessToken,
	generateCustomerRefreshToken,
} from '../utils/functions.js';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import valid from 'card-validator';


export const password_regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//Successfull login
const successFullLogin = async (res, customer) => {
	const accessToken = generateCustomerAccessToken(customer._id);
	const { refreshToken, unique } = generateCustomerRefreshToken(customer._id);

	customer.refreshTokens.push({
		token: refreshToken,
		unique,
	});
	await customer.save();

	res.status(200).json({
		success: true,
		accessToken,
		refreshToken,
        customer,
	});
};


//Register a new customer
const registerCustomer = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		res.status(400);
		throw new Error('Please provide name, email, and password');
	}

	if (!email_regex.test(email)) {
		res.status(400);
		throw new Error('Invalid email');
	}

	if (!password_regex.test(password)) {
		res.status(400);
		throw new Error(
			'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.'
		);
	}

	const customerExists = await Costumer.findOne({ email: new RegExp(`^${email}$`, 'i') });
	const businessExists = await Business.findOne({ email: new RegExp(`^${email}$`, 'i') });

	if (customerExists || businessExists) {
		res.status(409);
		throw new Error('Email already in use');
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	await Costumer.create({
		name,
		email,
		password: hashedPassword,
	});

	res.status(201).json({
		success: true,
		message: 'Customer registered successfully',
	});
});

//Customer login
const loginCustomer = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400);
		throw new Error('Please provide email and password');
	}

	if (!email_regex.test(email)) {
		res.status(400);
		throw new Error('Invalid email');
	}

	const customer = await Costumer.findOne({ email: new RegExp(`^${email}$`, 'i') });


	if (!customer) {
		res.status(404);
		throw new Error('Customer not found');
	}

	const isMatch = await bcrypt.compare(password, customer.password);

	if (!isMatch) {
		res.status(401);
		throw new Error('Invalid password');
	}

	await successFullLogin(res, customer);
});

//Google login for customers
const googleLoginCustomer = asyncHandler(async (req, res) => {
	const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage');
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
		res.status(400);
		throw new Error('Invalid email');
	}

	let customer = await Costumer.findOne({ email: new RegExp(`^${email}$`, 'i') });

	if (!customer) {
		customer = await Costumer.create({
			name: payload?.name,
			email,
			image: payload?.picture,
			phone: '',
			address: '',
			creditCard: {},
			rating: 0,
		});
	}

	await successFullLogin(res, customer);
});

//Update customer profile
const updateCustomer = asyncHandler(async (req, res) => {
	const { name, email, phone, address, image, creditCard, rating } = req.body;
	const customer = await Costumer.findById(req.customer._id);

	if (!customer) {
		res.status(404);
		throw new Error('Customer not found');
	}

	if (name) customer.name = name;
	if (email && email_regex.test(email)) customer.email = email;
	if (phone) customer.phone = phone;
	if (address) customer.address = address;
	if (image) customer.image = image;
	if (creditCard) customer.creditCard = creditCard;
	if (rating !== undefined) customer.rating = rating;

	await customer.save();

	res.status(200).json({
		success: true,
		customer: {
			name: customer.name,
			email: customer.email,
			phone: customer.phone,
			address: customer.address,
			image: customer.image,
			rating: customer.rating,
		},
	});
});

//Update customer password
const updateCustomerPassword = asyncHandler(async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	const customer = await Costumer.findById(req.customer._id);

	if (!customer) {
		res.status(404);
		throw new Error('Customer not found');
	}

	const isMatch = await bcrypt.compare(oldPassword, customer.password);

	if (!isMatch) {
		res.status(401);
		throw new Error('Invalid password');
	}

	if (!password_regex.test(newPassword)) {
		res.status(400);
		throw new Error(
			'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.'
		);
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(newPassword, salt);

	customer.password = hashedPassword;
	await customer.save();

	res.status(200).json({
		success: true,
		message: 'Password updated successfully',
	});
});

//Delete customer account
const deleteCustomer = asyncHandler(async (req, res) => {
	const customer = await Costumer.findById(req.customer._id);

	if (!customer) {
		res.status(404);
		throw new Error('Customer not found');
	}

	await customer.deleteOne();

	res.status(200).json({
		success: true,
		message: 'Customer account deleted successfully',
	});
});

//Get customer by ID
const getCustomerById = asyncHandler(async (req, res) => {
	const customer = await Costumer.findById(req.params.id).select('-password');

	if (!customer) {
		res.status(404);
		throw new Error('Customer not found');
	}

	res.status(200).json({
		success: true,
		customer,
	});
});

//Refreshtoken
const refreshTokens = asyncHandler(async (req, res) => {
	const { refreshToken } = req.body;

	if (!refreshToken) {
		res.status(400);
		throw new Error('Refresh token is required');
	}

    console.log("Using secret:", process.env.JWT_SECRET_REFRESH_COSTUMER);

	let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_COSTUMER);
    } catch (err) {
        throw new Error('Invalid or expired refresh token');
    }

	const customer = await Costumer.findById(decoded.id);
	if (!customer) {
		res.status(404);
		throw new Error('Customer not found');
	}

	// Check if the refresh token exists in DB
	const storedToken = customer.refreshTokens.find(
		(entry) => entry.token === refreshToken
	);

	if (!storedToken) {
		res.status(403);
		throw new Error('Refresh token not recognized');
	}

	// Remove the old token
	customer.refreshTokens = customer.refreshTokens.filter(
		(entry) => entry.token !== refreshToken
	);

	// Generate new tokens
	const newAccessToken = generateCustomerAccessToken(customer._id);
	const { refreshToken: newRefreshToken, unique } = generateCustomerRefreshToken(customer._id);

	// Store new refresh token
	customer.refreshTokens.push({ token: newRefreshToken, unique });
	await customer.save();

	res.status(200).json({
		success: true,
		accessToken: newAccessToken,
		refreshToken: newRefreshToken,
	});
});

// Update credit card info with validation
// Update credit card info with validation
const updateCustomerCreditCard = asyncHandler(async (req, res) => {
	const { number, expiry, cvv, cardHolderName } = req.body;

	// בדיקה שכל השדות קיימים
	if (!number || !expiry || !cvv || !cardHolderName) {
		res.status(400);
		throw new Error('Missing credit card details');
	}

	// ולידציה
	const numberValidation = valid.number(number);
	const expiryValidation = valid.expirationDate(expiry);
	const cvvValidation = valid.cvv(cvv);

	if (!numberValidation.isValid || !expiryValidation.isValid || !cvvValidation.isValid) {
		res.status(401);
		throw new Error('Invalid credit card information');
	}

	// תיקון טעות קטנה: req.customer ולא req.costumer
	const customer = await Costumer.findById(req.costumer._id);
	if (!customer) {
		res.status(402);
		throw new Error('Customer not found');
	}

	// עדכון הכרטיס
	customer.creditCard = {
		number: `**** **** **** ${number.slice(-4)}`, // שמירה חלקית
		expiry,
		cardHolderName,
		cardType: numberValidation.card?.niceType || 'Unknown'
	};

	await customer.save();

	res.status(200).json({
		success: true,
		message: 'Credit card updated successfully',
		card: customer.creditCard
	});
});




export {
	registerCustomer,
	loginCustomer,
	googleLoginCustomer,
	updateCustomer,
	deleteCustomer,
	updateCustomerPassword,
	getCustomerById,
    refreshTokens,
	updateCustomerCreditCard,
};
