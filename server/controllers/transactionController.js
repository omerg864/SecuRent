import asyncHandler from 'express-async-handler';
import Transaction from '../models/transactionModel.js';
import Item from '../models/itemModel.js';
import { businesses } from '../config/websocket.js';

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
	const transaction = new Transaction({
		amount,
		currency,
		status: 'open',
		business,
		customer: req.customer._id,
		description: 'Deposit',
	});
	await transaction.save();
	res.status(201).json({
		success: true,
		transaction,
	});
});

const createTransactionFromItem = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const item = await Item.findById(id);
	if (!item) {
		res.status(404);
		throw new Error('Transaction details not found');
	}
	

	// TODO: use paypal for create transaction
	const transaction_id = Math.random().toString(36).substring(7);
	const transaction = new Transaction({
		transaction_id,
		amount: item.price,
		currency: item.currency,
		status: 'open',
		business: item.business,
		customer: req.customer._id,
		description: item.description,
		return_date: item.return_date,
		opened_at: Date.now(),
	});
	await transaction.save();

	if (item.temporary) {
		await Item.findByIdAndDelete(id);
	}

	const businessAssociated = businesses.filter(
		(ws) => ws.id === item.business.toString()
	);

	if (businessAssociated.length > 0) {
		for (const ws of businessAssociated) {
			ws.send(
				JSON.stringify({
					type: 'newTransaction',
					data: {
						item
					},
				})
			);
		}
	}

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

const getTransactionById = asyncHandler(async (req, res) => {
	const transaction = await Transaction.findById(req.params.id);
	if (!transaction) {
		res.status(404);
		throw new Error('Transaction not found');
	}
	res.status(200).json({
		success: true,
		transaction,
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
	createTransactionFromItem,
	getTransactionById,
};
