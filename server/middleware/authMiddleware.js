import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Admin from '../models/adminModel.js';
import Customer from '../models/customerModel.js';
import Business from '../models/businessModel.js';

const authAny = asyncHandler(async (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
  
	if (!token) {
	  res.status(401);
	  throw new Error('Not authorized, no token');
	}
  
	let decoded;
  
	try {
	  decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS_COSTUMER);
	  const customer = await Customer.findById(decoded.id);
	  if (customer) {
		req.customer = customer;
		return next();
	  }
	} catch {}
  
	try {
	  decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS_BUSINESS);
	  const business = await Business.findById(decoded.id);
	  if (business) {
		req.business = business;
		return next();
	  }
	} catch {}
  
	try {
	  decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN_ACCESS);
	  const admin = await Admin.findById(decoded.id);
	  if (admin) {
		req.admin = admin;
		return next();
	  }
	} catch {}
  
	res.status(401);
	throw new Error('Not authorized, token failed');
  });
  

const authCustomer = asyncHandler(async (req, res, next) => {
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

	const customer = await Customer.findById(decoded.id);

	if (!customer) {
		res.status(404);
		throw new Error('Customer not found');
	}

	req.customer = customer;

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

export { authCustomer, authBusiness, authAdmin , authAny };
