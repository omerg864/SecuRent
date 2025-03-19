import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Admin from '../models/adminModel.js';
import Costumer from '../models/costumerModel.js';
import Business from '../models/businessModel.js';

const authCostumer = asyncHandler(async (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		res.status(401);
		throw new Error('Not authorized, no token');
	}
	let decoded;
	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS_COSTUMER);
	} catch (error) {
		res.status(401);
		throw new Error('Not authorized, token failed');
	}

	const costumer = await Costumer.findById(decoded.id);

	if (!costumer) {
		res.status(404);
		throw new Error('Costumer not found');
	}

	req.costumer = costumer;

	next();
});

const authBusiness = asyncHandler(async (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		res.status(401);
		throw new Error('Not authorized, no token');
	}
	let decoded;
	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS_BUSINESS);
	} catch (error) {
		res.status(401);
		throw new Error('Not authorized, token failed');
	}

	const business = await Business.findById(decoded.id);

	if (!business) {
		res.status(404);
		throw new Error('Business not found');
	}

	req.business = business;

	next();
});

const authAdmin = asyncHandler(async (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		res.status(401);
		throw new Error('Not authorized, no token');
	}
	let decoded;
	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN_ACCESS);
	} catch (error) {
		res.status(401);
		throw new Error('Not authorized, token failed');
	}

	const admin = await Admin.findById(decoded.id);

	if (!admin) {
		res.status(404);
		throw new Error('Admin not found');
	}

	req.admin = admin;

	next();
});

export { authCostumer, authBusiness, authAdmin };
