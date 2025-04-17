import asyncHandler from 'express-async-handler';
import Transaction from '../models/transactionModel.js';
import Item from '../models/itemModel.js';
import { businesses } from '../config/websocket.js';
import stripe from '../config/stripe.js';
import Customer from '../models/customerModel.js';

const getBusinessTransactions = asyncHandler(async (req, res) => {
	const transactions = await Transaction.find({
		business: req.business._id,
		status: { $ne: 'intent' },
	}).populate('customer', 'name image phone');
	res.status(200).json({
		success: true,
		transactions,
	});
});

const getCustomerTransactions = asyncHandler(async (req, res) => {
	const transactions = await Transaction.find({
		customer: req.customer._id,
		status: { $ne: 'intent' },
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
	if (transaction.status === 'intent') {
		res.status(400);
		throw new Error("Transaction is in 'intent' state");
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
	if (transaction.status === 'intent') {
		res.status(400);
		throw new Error("Transaction is in 'intent' state");
	}
	res.status(200).json({
		success: true,
		transaction,
	});
});

const createTransaction = asyncHandler(async (req, res) => {
	const { amount, currency, business } = req.body;

	if (!amount || !currency || !business) {
		res.status(400);
		throw new Error('Missing required fields');
	}

	const paymentIntent = await stripe.paymentIntents.create({
		amount: amount * 100, // Stripe expects amount in cents
		currency,
		payment_method_types: ['card'],
		capture_method: 'manual', // Set to manual to authorize only (not capture, only deposit)
	});

	const transaction = new Transaction({
		stripe_payment_intent_id: paymentIntent.id,
		amount,
		currency,
		status: 'intent',
		business,
		customer: req.customer._id,
		description: 'Deposit',
		opened_at: new Date(),
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
		res.status(403);
		throw new Error('Item details not found');
	}

	const customer = await Customer.findById(req.customer._id);

	if (!customer) {
		res.status(404);
		throw new Error('Customer not found');
	}

	if (!customer.stripe_customer_id) {
		res.status(400);
		throw new Error('Stripe customer not initialized');
	}

	const paymentIntent = await stripe.paymentIntents.create(
		{
			amount: item.price * 100,
			currency: item.currency,
			payment_method_types: ['card'],
			capture_method: 'manual',
			customer: customer.stripe_customer_id,
		},
		{
			stripeAccount: item.business.stripe_account_id,
		}
	);

	const transaction = new Transaction({
		stripe_payment_intent_id: paymentIntent.id,
		amount: item.price,
		currency: item.currency,
		status: 'intent',
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
						item,
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

const closeTransactionById = asyncHandler(async (req, res) => {
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

	if (transaction.status !== 'open') {
		res.status(400);
		throw new Error('Transaction is not in an authorized state');
	}

	await stripe.paymentIntents.cancel(transaction.stripe_payment_id);

	transaction.status = 'closed';
	transaction.closed_at = new Date();

	await transaction.save();

	res.status(200).json({
		success: true,
		message: 'Deposit released successfully. Customer was not charged.',
		transaction,
	});
});

const captureDeposit = asyncHandler(async (req, res) => {
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

	if (transaction.status !== 'open') {
		res.status(400);
		throw new Error('Transaction is not in open state');
	}

	const amountToCharge = amount ? amount * 100 : transaction.amount * 100;

	await stripe.paymentIntents.capture(transaction.stripe_payment_id, {
		amount_to_capture: amountToCharge,
	});

	const chargedAmount = amount || transaction.amount; // charge full amount if not specified a partial amount

	transaction.status = 'charged';
	transaction.closed_at = new Date();
	transaction.charged = chargedAmount;
	transaction.charged_description =
		charged_description || 'Charged full deposit';

	await transaction.save();

	res.status(200).json({
		success: true,
		message: `Deposit of ${chargedAmount} ${transaction.currency.toUpperCase()} captured successfully.`,
		transaction,
	});
});

const getTransactionAdmin = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const transaction = await Transaction.findById({
		id,
		status: { $ne: 'intent' },
	})
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
	const transactions = await Transaction.find({
		customer: id,
		status: { $ne: 'intent' },
	}).populate('business', 'name image rating category');
	res.status(200).json({
		success: true,
		transactions,
	});
});

const getBusinessTransactionsAdmin = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const transactions = await Transaction.find({
		business: id,
		status: { $ne: 'intent' },
	}).populate('customer', 'name image phone');
	res.status(200).json({
		success: true,
		transactions,
	});
});

const getTransactionById = asyncHandler(async (req, res) => {
	console.log('Checking transaction by id');
	const transaction = await Transaction.findById(req.params.id);
	if (!transaction) {
		res.status(404);
		throw new Error('Transaction not found');
	}
	if (transaction.status === 'intent') {
		res.status(400);
		throw new Error("Transaction is in 'intent' state");
	}

	if (
		req.customer &&
		transaction.customer.toString() !== req.customer._id.toString()
	) {
		res.status(401);
		throw new Error('Unauthorized');
	}

	if (
		req.business &&
		transaction.business.toString() !== req.business._id.toString()
	) {
		res.status(401);
		throw new Error('Unauthorized');
	}
	res.status(200).json({
		success: true,
		transaction,
	});
});

const confirmTransactionPayment = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { isPaymentConfirmed } = req.body;

	const transaction = await Transaction.findById(id);
	if (!transaction) {
		res.status(404);
		throw new Error('Transaction not found');
	}

	if (transaction.status !== 'intent') {
		res.status(400);
		throw new Error("Transaction is not in an 'intent' state");
	}

	if (!isPaymentConfirmed) {
		res.status(400);
		throw new Error('Payment not confirmed by frontend');
	}

	const paymentIntent = await stripe.paymentIntents.retrieve(
		transaction.stripe_payment_id
	);

	if (paymentIntent.status !== 'requires_capture') {
		res.status(400);
		throw new Error(
			`PaymentIntent not ready for capture. Status: ${paymentIntent.status}`
		);
	}

	transaction.status = 'open';
	await transaction.save();

	res.status(200).json({
		success: true,
		message: 'Transaction confirmed and marked as open.',
		transaction,
	});
});

const deleteIntentTransaction = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const transaction = await Transaction.findById(id);
	if (!transaction) {
		res.status(404);
		throw new Error('Transaction not found');
	}

	if (transaction.customer.toString() !== req.customer._id.toString()) {
		res.status(403);
		throw new Error('Not authorized to delete this transaction');
	}

	if (transaction.status !== 'intent') {
		res.status(400);
		throw new Error("Only transactions in 'intent' status can be deleted");
	}

	await transaction.deleteOne();

	res.status(200).json({
		success: true,
		message: 'Transaction deleted successfully',
	});
});

export {
	getBusinessTransactions,
	getCustomerTransactions,
	getTransactionByCustomer,
	getTransactionByBusiness,
	createTransaction,
	getTransactionAdmin,
	getCustomerTransactionsAdmin,
	getBusinessTransactionsAdmin,
	createTransactionFromItem,
	getTransactionById,
	closeTransactionById,
	captureDeposit,
	confirmTransactionPayment,
	deleteIntentTransaction,
};
