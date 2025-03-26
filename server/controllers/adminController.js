import asyncHandler from 'express-async-handler';
import Admin from '../models/adminModel.js';
import { email_regex, password_regex } from '../utils/regex.js';
import {
	generateAdminAccessToken,
	generateAdminRefreshToken,
	generateBusinessAccessToken,
	generateBusinessRefreshToken,
	generateCustomerAccessToken,
	generateCustomerRefreshToken,
} from '../utils/functions.js';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import Business from '../models/businessModel.js';
import Customer from '../models/customerModel.js';

const successFullLogin = async (res, admin) => {
	const accessToken = generateAdminAccessToken(admin._id);
	const { refreshToken, unique } = generateAdminRefreshToken(admin._id);

	admin.refreshTokens.push({ token: refreshToken, unique });
	await admin.save();

	res.status(200).json({
		success: true,
		accessToken,
		refreshToken,
		admin: {
			name: admin.name,
			email: admin.email,
			role: admin.role,
			picture: admin.picture,
		},
	});
};

const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400);
		throw new Error('Please provide email and password');
	}

	if (!email_regex.test(email)) {
		res.status(400);
		throw new Error('Invalid email');
	}

	const admin = await Admin.findOne({
		email: { $regex: new RegExp(`^${email}$`, 'i') },
	});

	if (!admin) {
		res.status(404);
		throw new Error('Admin not found');
	}

	if (!admin.isVerified) {
		res.status(401);
		throw new Error('Admin not verified');
	}

	const isMatch = await bcrypt.compare(password, admin.password);

	if (!isMatch) {
		res.status(401);
		throw new Error('Invalid password');
	}
	successFullLogin(res, admin);
});

const register = asyncHandler(async (req, res) => {
	const { name, role, email, password } = req.body;

	if (!name || !role || !email || !password) {
		res.status(400);
		throw new Error('Please provide all fields');
	}

	if (!email_regex.test(email)) {
		res.status(400);
		throw new Error('Invalid email');
	}

	if (password_regex.test(password)) {
		res.status(400);
		throw new Error('Password is not strong enough');
	}

	const adminExists = await Admin.findOne({
		email: { $regex: new RegExp(`^${email}$`, 'i') },
	});

	if (adminExists) {
		res.status(400);
		throw new Error('Admin already exists');
	}

	const admin = await Admin.create({
		name,
		role,
		email,
		password,
	});

	res.status(201).json({
		success: true,
	});
});

const googleLogin = asyncHandler(async (req, res) => {
	const client = new OAuth2Client(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		'postmessage'
	);
	const { code } = req.body;
	if (!code) {
		res.status(400);
		throw new Error('No code provided');
	}
	const response = await client.getToken(code);
	const ticket = await client.verifyIdToken({
		idToken: response.tokens.id_token,
		audience: process.env.GOOGLE_CLIENT_ID,
	});

	const payload = ticket.getPayload();
	if (!payload) {
		res.status(400);
		throw new Error('Invalid code');
	}

	const email = payload.email;
	if (!email) {
		res.status(400);
		throw new Error('Invalid email');
	}
	const admin = await Admin.findOne({
		email: { $regex: new RegExp(`^${email}$`, 'i') },
	});
	if (!admin) {
		res.status(404);
		throw new Error('Admin not found');
	} else {
		if (!admin.isVerified) {
			res.status(401);
			throw new Error('Admin not verified');
		}
		successFullLogin(res, admin);
	}
});

const updateAdmin = asyncHandler(async (req, res) => {
	// TODO: update picture in cloud
	const { name, email, picture } = req.body;
	const admin = await Admin.findById(req.admin._id);

	if (name) {
		admin.name = name;
	}

	if (email && email_regex.test(email)) {
		admin.email = email;
	}

	if (picture) {
		admin.picture = picture;
	}

	await admin.save();

	res.status(200).json({
		success: true,
		admin: {
			name: admin.name,
			email: admin.email,
			role: admin.role,
			picture: admin.picture,
		},
	});
});

const deleteAdmin = asyncHandler(async (req, res) => {
	// TODO: remove from cloud
	const { id } = req.params;
	const admin = await Admin.findById(id);
	if (!admin) {
		res.status(404);
		throw new Error('Admin not found');
	}
	await admin.remove();
	res.status(200).json({
		success: true,
	});
});

const verifyAdmin = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const admin = await Admin.findById(id);
	if (!admin) {
		res.status(404);
		throw new Error('Admin not found');
	}
	admin.isVerified = true;
	await admin.save();
	res.status(200).json({
		success: true,
	});
});

const successFullBusinessLogin = async (res, business) => {
	const accessToken = generateBusinessAccessToken(business._id);
	const { refreshToken, unique } = generateBusinessRefreshToken(business._id);

	if (!business.refreshTokens) business.refreshTokens = [];
	business.refreshTokens.push({ token: refreshToken, unique });
	await business.save();

	res.status(200).json({
		success: true,
		accessToken,
		refreshToken,
		user: business,
	});
};

const successFullCustomerLogin = async (res, customer) => {
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
		user: customer,
	});
};

const loginClient = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	console.log(email, password);

	if (!email || !password) {
		res.status(400);
		throw new Error('Please fill in all fields');
	}

	const business = await Business.findOne({
		email: new RegExp(`^${email}$`, 'i'),
	});

	if (business) {

		const isMatch = await bcrypt.compare(password, business.password);

		if (!isMatch) {
			res.status(401);
			throw new Error('Invalid email or password');
		}

		await successFullBusinessLogin(res, business);
	} else {
		const customer = await Customer.findOne({
			email: new RegExp(`^${email}$`, 'i'),
		});

		if (!customer) {
			res.status(404);
			throw new Error('User not found');
		}

		const isMatch = await bcrypt.compare(password, customer.password);

		if (!isMatch) {
			res.status(401);
			throw new Error('Invalid password');
		}

		await successFullCustomerLogin(res, customer);
	}
});

export {
	login,
	register,
	googleLogin,
	updateAdmin,
	deleteAdmin,
	verifyAdmin,
	loginClient,
};
