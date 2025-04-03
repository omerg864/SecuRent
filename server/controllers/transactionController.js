import asyncHandler from 'express-async-handler';
import Transaction from '../models/transactionModel.js';

const getBusinessTransactions = asyncHandler(async (req, res) => {
	const transactions = await Transaction.find({
		business: req.business._id,
	}).populate('customer', 'name image phone');
	res.status(200).json({
		success: true,
		transactions,
	});
});

const getCustomerTransactions = asyncHandler(async (req, res) => {
	const transactions = await Transaction.find({
		customer: req.customer._id,
	}).populate('business', 'name image rating category');
	res.status(200).json({
		success: true,
		transactions,
	});
});

const getTransactionByCustomer = asyncHandler(async (req, res) => {
	const transaction = await Transaction.findById(req.params.id);
	if (!transaction) {
		res.status(404);
		throw new Error('Transaction not found');
	}
	if (transaction.customer.toString() !== req.customer._id.toString()) {
		res.status(401);
		throw new Error('Unauthorized');
	}
	res.status(200).json({
		success: true,
		transaction,
	});
});

const getTransactionByBusiness = asyncHandler(async (req, res) => {
	const transaction = await Transaction.findById(req.params.id);
	if (!transaction) {
		res.status(404);
		throw new Error('Transaction not found');
	}
	if (transaction.business.toString() !== req.business._id.toString()) {
		res.status(401);
		throw new Error('Unauthorized');
	}
	res.status(200).json({
		success: true,
		transaction,
	});
});

const createTransaction = asyncHandler(async (req, res) => {
	const { amount, currency, business } = req.body;
	// TODO: use paypal for create transaction
	const transaction_id = Math.random().toString(36).substring(7);
	const transaction = new Transaction({
		amount,
		currency,
		status: 'open',
		business,
		customer: req.customer._id,
		transaction_id,
	});
	await transaction.save();
	res.status(201).json({
		success: true,
		transaction,
	});
});

const releaseDeposit = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const transaction = await Transaction.findById(id);
	if (!transaction) {
		res.status(404);
		throw new Error('Transaction not found');
	}
	if (transaction.business.toString() !== req.business._id.toString()) {
		res.status(401);
		throw new Error('Unauthorized');
	}
	// TODO: use paypal for release deposit
	transaction.status = 'closed';
	await transaction.save();
	res.status(200).json({
		success: true,
		transaction,
	});
});

const chargeDeposit = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { charged_description, amount } = req.body;
	const transaction = await Transaction.findById(id);
	if (!transaction) {
		res.status(404);
		throw new Error('Transaction not found');
	}
	if (transaction.business.toString() !== req.business._id.toString()) {
		res.status(401);
		throw new Error('Unauthorized');
	}
	// TODO: use paypal for charge deposit
	transaction.status = 'charged';
	transaction.charged = amount;
	transaction.charged_description = charged_description;
	await transaction.save();
	res.status(200).json({
		success: true,
		transaction,
	});
});

const getTransactionAdmin = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const transaction = await Transaction.findById(id)
		.populate('business', 'name image rating category')
		.populate('customer', 'name image phone');
	if (!transaction) {
		res.status(404);
		throw new Error('Transaction not found');
	}
	res.status(200).json({
		success: true,
		transaction,
	});
});

const getCustomerTransactionsAdmin = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const transactions = await Transaction.find({ customer: id }).populate(
		'business',
		'name image rating category'
	);
	res.status(200).json({
		success: true,
		transactions,
	});
});

const getBusinessTransactionsAdmin = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const transactions = await Transaction.find({ business: id }).populate(
		'customer',
		'name image phone'
	);
	res.status(200).json({
		success: true,
		transactions,
	});
});

export {
	getBusinessTransactions,
	getCustomerTransactions,
	getTransactionByCustomer,
	getTransactionByBusiness,
	createTransaction,
	releaseDeposit,
	chargeDeposit,
	getTransactionAdmin,
	getCustomerTransactionsAdmin,
	getBusinessTransactionsAdmin,
};
