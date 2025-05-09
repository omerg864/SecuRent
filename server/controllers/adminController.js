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
import Transaction from '../models/transactionModel.js';
import { sendEmail } from '../utils/functions.js';
import { uploadToCloudinary, deleteImage } from '../utils/cloudinary.js';
import { v4 as uuidv4 } from 'uuid';
import { admins } from '../config/websocket.js';
import jwt from 'jsonwebtoken';
import Notification from '../models/notificationModel.js';
import { businesses, customers } from '../config/websocket.js';

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
			image: admin.image,
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

	admins.forEach((ws) => {
		ws.send(
			JSON.stringify({
				type: 'adminLogin',
				data: {
					id: admin._id,
					name: admin.name,
				},
			})
		);
	});

	const isMatch = await bcrypt.compare(password, admin.password);

	if (!isMatch) {
		res.status(401);
		throw new Error('Invalid password');
	}
	successFullLogin(res, admin);
});

const register = asyncHandler(async (req, res) => {
	const { name, role, email, password, code } = req.body;

	if (!name || !role || !email || !password || !code) {
		throw new Error('Please provide all fields');
	}

	if (process.env.ADMIN_CODE !== code) {
		throw new Error('Invalid verification code');
	}

	if (!email_regex.test(email)) {
		throw new Error('Invalid email');
	}

	if (!password_regex.test(password)) {
		throw new Error('Password is not strong enough');
	}

	const adminExists = await Admin.findOne({
		email: { $regex: new RegExp(`^${email}$`, 'i') },
	});

	if (adminExists) {
		throw new Error('Admin already exists');
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	let imageUrl = '';

	if (req.file) {
		const imageID = uuidv4();
		imageUrl = await uploadToCloudinary(
			req.file.buffer,
			`${process.env.CLOUDINARY_BASE_FOLDER}/admins`,
			imageID
		);
	}

	await Admin.create({
		name,
		role,
		email,
		password: hashedPassword,
		image: imageUrl,
	});

	res.status(201).json({
		success: true,
		message: 'Admin registered successfully',
	});
});

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
			process.env.JWT_SECRET_ADMIN_REFRESH
		);
	} catch (err) {
		throw new Error('Invalid or expired refresh token');
	}

	const admin = await Admin.findById(decoded.id);
	if (!admin) {
		res.status(404);
		throw new Error('Business not found');
	}

	const storedToken = admin.refreshTokens?.find(
		(t) => t.token === refreshToken
	);
	if (!storedToken) {
		res.status(403);
		throw new Error('Refresh token not recognized');
	}

	admin.refreshTokens = admin.refreshTokens.filter(
		(t) => t.token !== refreshToken
	);

	const accessToken = generateAdminAccessToken(admin._id);
	const { refreshToken: newRefreshToken, unique } = generateAdminRefreshToken(
		admin._id
	);
	admin.refreshTokens.push({ token: newRefreshToken, unique });

	await admin.save();

	res.status(200).json({
		success: true,
		accessToken,
		refreshToken: newRefreshToken,
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
	const { name, email, image, imageDeleteFlag } = req.body;
	const admin = await Admin.findById(req.admin._id);

	if (!admin) {
		res.status(404);
		throw new Error('Admin not found');
	}

	if (req.file) {
		if (admin.image) {
			await deleteImage(admin.image, true);
		}
		const imageID = uuidv4();
		const imageUrl = await uploadToCloudinary(
			req.file.buffer,
			`${process.env.CLOUDINARY_BASE_FOLDER}/admins`,
			imageID
		);
	} else if (imageDeleteFlag) {
		if (admin.image) {
			await deleteImage(admin.image, true);
		}
		admin.image = '';
	}

	if (name) admin.name = name;
	if (email && email_regex.test(email)) admin.email = email;

	await admin.save();

	res.status(200).json({
		success: true,
		admin: {
			name: admin.name,
			email: admin.email,
			role: admin.role,
			image: admin.image,
		},
	});
});

const deleteAdmin = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const admin = await Admin.findById(id);
	if (!admin) {
		res.status(404);
		throw new Error('Admin not found');
	}

	if (admin.image) {
		await deleteImage(admin.image, true);
	}
	await admin.deleteOne();
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

		if (customer.suspended) {
			res.status(401);
			throw new Error('Account is suspended');
		}

		await successFullCustomerLogin(res, customer);
	}
});

const identifyUser = asyncHandler(async (req, res) => {
	const { email } = req.query;
	const business = await Business.findOne({
		email: new RegExp(`^${email}$`, 'i'),
	});

	if (business) {
		const accessToken = generateBusinessAccessToken(business._id);
		const refreshToken = generateBusinessRefreshToken(business._id);

		const verificationCode = Math.floor(
			100000 + Math.random() * 900000
		).toString();
		const subject = 'Verify Your Email';
		const text = `Your verification code is: ${verificationCode}`;

		const html = `
				  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
					  <h2 style="color: #333;">Verify Your Email</h2>
					  <p>Please use the code below to verify your email address:</p>
					  <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color:rgb(76, 87, 175);">${verificationCode}</div>
					  <p>If you didn't request this, secure your email account.</p>
				  </div>
			  `;

		await sendEmail(email, subject, text, html);

		business.verificationCode = verificationCode;
		await business.save();

		res.status(200).json({
			success: true,
			type: 'business',
			userId: business._id,
		});
	} else {
		const customer = await Customer.findOne({
			email: new RegExp(`^${email}$`, 'i'),
		});

		if (!customer) {
			res.status(404);
			throw new Error('User not found');
		}
		const accessToken = generateCustomerAccessToken(customer._id);
		const refreshToken = generateCustomerRefreshToken(customer._id);

		const verificationCode = Math.floor(
			100000 + Math.random() * 900000
		).toString();
		const subject = 'Verify Your Email';
		const text = `Your verification code is: ${verificationCode}`;

		const html = `
					<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
						<h2 style="color: #333;">Verify Your Email</h2>
						<p>Please use the code below to verify your email address:</p>
						<div style="font-size: 24px; font-weight: bold; margin: 20px 0; color:rgb(76, 87, 175);">${verificationCode}</div>
						<p>If you didn't request this, secure your email account.</p>
					</div>
				`;

		await sendEmail(email, subject, text, html);

		customer.verificationCode = verificationCode;
		await customer.save();

		res.status(200).json({
			success: true,
			type: 'customer',
			userId: customer._id,
		});
	}
});

const adminAnalytics = asyncHandler(async (req, res) => {
	const numCustomers = await Customer.countDocuments();
	const numBusinesses = await Business.countDocuments();
	const numTransactions = await Transaction.countDocuments();
	const numActiveTransactions = await Transaction.countDocuments({
		status: 'open',
	});
	const now = new Date();
	const oneYearAgo = new Date(now);
	oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

	const months = Array.from({ length: 12 }, (_, i) => i + 1); // Array of months [1, 2, ..., 12]
	const transactionsByMonth = await Transaction.aggregate([
		{
			$match: {
				createdAt: { $gte: oneYearAgo },
			},
		},
		{
			$group: {
				_id: {
					year: { $year: '$createdAt' },
					month: { $month: '$createdAt' },
				},
				totalTransactions: { $sum: '$amount' },
				chargedTransactions: {
					$sum: {
						$cond: [{ $eq: ['$status', 'charged'] }, '$amount', 0],
					},
				},
			},
		},
		{
			$sort: { '_id.year': 1, '_id.month': 1 },
		},
	]);

	// Fill in missing months with 0 values
	const filledTransactionsByMonth = [];
	const currentYear = now.getFullYear();
	const startYear = oneYearAgo.getFullYear();

	for (let year = startYear; year <= currentYear; year++) {
		for (const month of months) {
			if (year === startYear && month < oneYearAgo.getMonth() + 1)
				continue;
			if (year === currentYear && month > now.getMonth() + 1) break;

			const existingRecord = transactionsByMonth.find(
				(record) =>
					record._id.year === year && record._id.month === month
			);

			filledTransactionsByMonth.push(
				existingRecord || {
					_id: { year, month },
					totalTransactions: 0,
					chargedTransactions: 0,
				}
			);
		}
	}

	const startOfWeek = (date) => {
		const day = date.getDay();
		const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
		return new Date(date.setDate(diff));
	};

	const endOfWeek = (date) => {
		const start = startOfWeek(new Date(date));
		return new Date(start.setDate(start.getDate() + 6));
	};
	const startOfThisWeek = startOfWeek(new Date(now));
	const endOfThisWeek = endOfWeek(new Date(now));

	const startOfLastWeek = new Date(startOfThisWeek);
	startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
	const endOfLastWeek = new Date(endOfThisWeek);
	endOfLastWeek.setDate(endOfThisWeek.getDate() - 7);

	const daysOfWeek = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];

	const transactionsThisWeekRaw = await Transaction.aggregate([
		{
			$match: {
				createdAt: { $gte: startOfThisWeek, $lte: endOfThisWeek },
			},
		},
		{
			$group: {
				_id: { $dayOfWeek: '$createdAt' },
				numClosedTransactions: {
					$sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] },
				},
				numChargedTransactions: {
					$sum: { $cond: [{ $eq: ['$status', 'charged'] }, 1, 0] },
				},
			},
		},
	]);

	const transactionsLastWeekRaw = await Transaction.aggregate([
		{
			$match: {
				createdAt: { $gte: startOfLastWeek, $lte: endOfLastWeek },
			},
		},
		{
			$group: {
				_id: { $dayOfWeek: '$createdAt' },
				numClosedTransactions: {
					$sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] },
				},
				numChargedTransactions: {
					$sum: { $cond: [{ $eq: ['$status', 'charged'] }, 1, 0] },
				},
			},
		},
	]);

	const fillDaysOfWeek = (rawData) => {
		return daysOfWeek.map((day, index) => {
			const dayData = rawData.find((data) => data._id === index + 1);
			return {
				day,
				numClosedTransactions: dayData
					? dayData.numClosedTransactions
					: 0,
				numChargedTransactions: dayData
					? dayData.numChargedTransactions
					: 0,
			};
		});
	};

	const transactionsThisWeek = fillDaysOfWeek(transactionsThisWeekRaw);
	const transactionsLastWeek = fillDaysOfWeek(transactionsLastWeekRaw);

	res.status(200).json({
		success: true,
		analytics: {
			numCustomers,
			numBusinesses,
			numTransactions,
			numActiveTransactions,
			transactionsByMonth: filledTransactionsByMonth,
			oneYearAgo,
			now,
			transactionsThisWeek,
			transactionsLastWeek,
		},
	});
});

const getAllBusinesses = asyncHandler(async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const name = req.query.name || '';
	const limit = 10;
	const skip = (page - 1) * limit;

	const totalBusinesses = await Business.countDocuments();
	const totalPages = Math.ceil(totalBusinesses / limit);

	// search by name or partial name
	const businesses = await Business.find({
		name: { $regex: new RegExp(name, 'i') }, // match anywhere, case-insensitive
	})
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit)
		.select(
			'-password -refreshTokens -verificationCode -stripe_account_id'
		);

	for (let i = 0; i < businesses.length; i++) {
		const business = businesses[i].toObject(); // convert to plain object

		// Total transactions
		const transactionCount = await Transaction.countDocuments({
			business: business._id,
		});

		// Only "charged" transactions
		const chargedTransactionCount = await Transaction.countDocuments({
			business: business._id,
			status: 'charged',
		});

		business.transactionCount = transactionCount;
		business.chargedTransactionCount = chargedTransactionCount;

		businesses[i] = business; // update the array
	}

	res.status(200).json({
		success: true,
		page,
		totalPages,
		totalBusinesses,
		businesses,
	});
});

const toggleBusinessSuspension = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const business = await Business.findById(id);
	if (!business) {
		res.status(404);
		throw new Error('Business not found');
	}

	business.suspended = !business.suspended;
	await business.save();

	const notification = await Notification.create({
		type: 'business',
		title: 'Business Account Suspension',
		content: `Your account has been ${
			business.suspended ? 'suspended' : 'released from suspension'
		}`,
		business: business._id,
	});

	const associatedBusinesses = businesses.filter(
		(ws) => ws.id === business._id.toString()
	);

	if (associatedBusinesses.length > 0) {
		associatedBusinesses.forEach((ws) => {
			ws.send(
				JSON.stringify({
					type: 'notification',
					data: {
						notification: notification,
					},
				})
			);
		});
	}

	res.status(200).json({
		success: true,
		suspended: business.suspended,
	});
});

const toggleCustomerSuspension = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const customer = await Customer.findById(id);
	if (!customer) {
		res.status(404);
		throw new Error('Customer not found');
	}

	customer.suspended = !customer.suspended;
	await customer.save();

	const notification = await Notification.create({
		type: 'customer',
		title: 'Customer Account Suspension',
		content: `Your account has been ${
			customer.suspended ? 'suspended' : 'released from suspension'
		}`,
		customer: customer._id,
	});

	const associatedCustomers = customers.filter(
		(ws) => ws.id === customer._id.toString()
	);

	if (associatedCustomers.length > 0) {
		associatedCustomers.forEach((ws) => {
			ws.send(
				JSON.stringify({
					type: 'notification',
					data: {
						notification: notification,
					},
				})
			);
		});
	}

	res.status(200).json({
		success: true,
		suspended: customer.suspended,
	});
});

export {
	login,
	register,
	googleLogin,
	updateAdmin,
	deleteAdmin,
	verifyAdmin,
	loginClient,
	identifyUser,
	adminAnalytics,
	refreshTokens,
	getAllBusinesses,
	toggleBusinessSuspension,
	toggleCustomerSuspension,
};
