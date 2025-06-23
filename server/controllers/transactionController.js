import asyncHandler from 'express-async-handler';
import Transaction from '../models/transactionModel.js';
import Item from '../models/itemModel.js';
import { businesses, customers, admins } from '../config/websocket.js';
import stripe from '../config/stripe.js';
import {
	APP_URL,
	CHARGED_PERCENT_NOTIFICATION,
	TRANSACTION_NAME,
} from '../utils/constants.js';
import Business from '../models/businessModel.js';
import Notification from '../models/notificationModel.js';
import { sendEmail } from '../utils/functions.js';
import QRCode from 'qrcode';

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

	const businessDoc = await Business.findById(business);
	if (!businessDoc) {
		res.status(404);
		throw new Error('Business not found');
	}

	if (businessDoc.suspended) {
		res.status(403);
		throw new Error('Business is suspended');
	}

	if (!businessDoc.activated) {
		res.status(403);
		throw new Error('Business is not active');
	}

	if (!req.customer.stripe_customer_id) {
		res.status(400);
		throw new Error('Stripe customer not initialized');
	}

	const paymentIntent = await stripe.paymentIntents.create({
		amount: amount * 100, // Stripe expects amount in cents
		currency,
		payment_method_types: ['card'],
		capture_method: 'manual', // Set to manual to authorize only (not capture, only deposit)
	});

	const transaction = new Transaction({
		stripe_payment_id: paymentIntent.id,
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
	console.log('Creating transaction for item ID:', id);

	const item = await Item.findById(id);
	if (!item) {
		res.status(403);
		throw new Error('Item details not found');
	}

	const business = await Business.findById(item.business);
	if (business.suspended) {
		res.status(403);
		throw new Error('Business is suspended');
	}

	if (!business.activated) {
		res.status(403);
		throw new Error('Business is not active');
	}

	if (!req.customer.stripe_customer_id) {
		res.status(400);
		throw new Error('Stripe customer not initialized');
	}

	let price = item.price;

	if (item.smartPrice) {
		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
		const reviewModel = genAI.getGenerativeModel({
			model: 'gemini-2.0-flash',
			generationConfig: {
				responseMimeType: 'application/json',
				responseSchema: {
					type: SchemaType.NUMBER,
				},
			},
		});

		const customerTransactions = await Transaction.find({
			customer: req.customer._id,
		});

		const reviewPrompt = `You are a smart assistant for a digital deposit system. In this system, users (customers) make deposits when transacting with businesses. If something goes wrong—such as property damage, late return, or other issues—the business can charge all or part of the deposit.

Your job is to help determine how much to charge the customer for a new transaction, based on:
	•	The current transaction’s description and the minimum deposit price
	•	The customer’s past transactions, including:
	•	Description of each past transaction
	•	Deposit amount
	•	Whether the customer was charged, how much, and why

Consider the following:
	•	The more the customer has been charged in the past for similar reasons, the higher the deposit should be (to reduce business risk).
	•	If the customer has a clean record (no charges), you may recommend a deposit closer to the minimum.
	•	The nature of the current transaction also affects the price (e.g., high-risk items may require a higher deposit even for good customers).
	•	The reason for previous charges is important (e.g., repeated damage vs. one-time lateness).

Return the recommended deposit charge amount as a number only (e.g., 250) and nothing else. You must base it on patterns in the customer’s history and the transaction’s risk. 
Current transaction description: ${item.description}
Minimum deposit price: ${item.price}
Customer's past transactions: ${JSON.stringify(customerTransactions)}`;

		const newPriceResult = await reviewModel.generateContent(reviewPrompt);
		console.log('Price Result:', reviewResult.response.text());
		price = parseFloat(newPriceResult.response.text()) || item.price;
	}

	const paymentIntent = await stripe.paymentIntents.create(
		{
			amount: price * 100,
			currency: item.currency,
			payment_method_types: ['card'],
			capture_method: 'manual',
			customer: req.customer.stripe_customer_id,
		},
		{
			stripeAccount: item.business.stripe_account_id,
		}
	);

	let return_date = item.return_date;

	if (!item.temporary) {
		if (item.timeUnit === 'days') {
			return_date = new Date(
				Date.now() + item.duration * 24 * 60 * 60 * 1000
			);
		} else if (item.timeUnit === 'hours') {
			return_date = new Date(Date.now() + item.duration * 60 * 60 * 1000);
		} else if (item.timeUnit === 'minutes') {
			return_date = new Date(Date.now() + item.duration * 60 * 1000);
		}
	}

	let transaction = new Transaction({
		stripe_payment_id: paymentIntent.id,
		amount: price,
		currency: item.currency,
		status: 'intent',
		business: item.business,
		customer: req.customer._id,
		description: item.description,
		return_date,
		opened_at: Date.now(),
		item: item._id,
	});

	const businessDetails = await Business.findById(item.business).select(
		'name image rating category stripe_account_id'
	);

	if (!businessDetails) {
		res.status(404);
		throw new Error('Business not found');
	}

	await transaction.save();

	transaction.business = businessDetails;

	const ephemeralKey = await stripe.ephemeralKeys.create(
		{
			customer: req.customer.stripe_customer_id,
		},
		{
			apiVersion: '2023-10-16',
		}
	);

	res.status(201).json({
		success: true,
		transaction,
		clientSecret: paymentIntent.client_secret,
		customer_stripe_id: req.customer.stripe_customer_id,
		ephemeralKey: ephemeralKey.secret,
		transactionId: transaction._id,
		return_date: return_date ?? null,
	});
});

const closeTransactionById = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const transaction = await Transaction.findById(id)
		.populate('customer', 'name image phone')
		.populate('business', 'name image rating category');
	if (!transaction) {
		res.status(404);
		throw new Error('Transaction not found');
	}

	if (transaction.business._id.toString() !== req.business._id.toString()) {
		res.status(401);
		throw new Error('Unauthorized');
	}

	if (transaction.status !== 'open') {
		res.status(400);
		throw new Error('Transaction is not in an authorized state');
	}

	const business = await Business.findById(transaction.business._id);
	if (!business) {
		res.status(404);
		throw new Error('Business not found');
	}

	await stripe.paymentIntents.cancel(transaction.stripe_payment_id, {
		stripeAccount: transaction.business.stripe_account_id,
	});

	transaction.status = 'closed';
	transaction.closed_at = new Date();

	await transaction.save();

	const transactionCount =
		(await Transaction.countDocuments({
			business: transaction.business._id,
		})) || 0;

	const chargedTransactionCount = await Transaction.countDocuments({
		business: transaction.business._id,
		status: 'charged',
	});

	const notification = await Notification.create({
		title: 'transaction closed',
		content: `Deposit of ${transaction.description} released successfully.`,
		customer: transaction.customer,
		type: 'customer',
	});

	const customerAssociated = customers.filter(
		(ws) => ws.id === transaction.customer.toString()
	);

	if (customerAssociated.length > 0) {
		for (const ws of customerAssociated) {
			ws.send(
				JSON.stringify({
					type: 'notification',
					data: {
						notification: notification,
					},
				})
			);
			ws.send(
				JSON.stringify({
					type: 'endTransaction',
					data: {
						transaction: transaction,
					},
				})
			);
		}
	}

	const plainText = `
✅ Deposit Released

Hello ${transaction.customer.name},

Your deposit for the transaction with ${
		transaction.business.name
	} has been successfully released.

Transaction Details:
- Description: ${transaction.description}
- Amount: ${transaction.amount} ${transaction.currency.toUpperCase()}
- Opened At: ${new Date(transaction.opened_at).toLocaleString()}
- Closed At: ${new Date(transaction.closed_at).toLocaleString()}
- Business: ${transaction.business.name}

No charge has been made to your payment method.

Thank you,
SecuRent Team
`;

	const html = `
  <div style="font-family: Arial, sans-serif; color: #1e3a8a; line-height: 1.5;">
    <h2 style="color: #1e3a8a;">✅ Deposit Released</h2>
    <p>Hello <strong>${transaction.customer.name}</strong>,</p>

    <p>Your deposit for the transaction with <strong>${
		transaction.business.name
	}</strong> has been successfully released.</p>

    <h3 style="color: #1e3a8a;">Transaction Details</h3>
    <ul style="padding-left: 16px;">
      <li><strong>Description:</strong> ${transaction.description}</li>
      <li><strong>Amount:</strong> ${
			transaction.amount
		} ${transaction.currency.toUpperCase()}</li>
      <li><strong>Opened At:</strong> ${new Date(
			transaction.opened_at
		).toLocaleString()}</li>
      <li><strong>Closed At:</strong> ${new Date(
			transaction.closed_at
		).toLocaleString()}</li>
      <li><strong>Business:</strong> ${transaction.business.name}</li>
    </ul>

    <p>No charge has been made to your payment method.</p>

    <p>If you have any questions, feel free to reply to this email or contact our support team.</p>

    <p>Thank you,<br/>The <strong>BlueApp</strong> Team</p>
  </div>
`;
	await sendEmail(
		transaction.customer.email,
		'Deposit Released',
		plainText,
		html
	);

	if (!business.rating) {
		business.rating = {
			reviewOverall: 5,
			quality: 0,
			reliability: 0,
			price: 0,
			charged: 5,
			overall: 0,
		};
	}

	// const chargedScore = 5 - (chargedTransactionCount / transactionCount) * 5;
	// const reviewOverallScore = business.rating.reviewOverall || 5;
	// const reviewScoreWeight = reviewOverallScore * REVIEW_WEIGHT;
	// const chargedScoreWeight = chargedScore * CHARGED_WEIGHT;
	// let overAllScore = reviewScoreWeight + chargedScoreWeight;
	// if (!reviewScoreWeight && !chargedScoreWeight) {
	// 	overAllScore = 5;
	// } else if (!reviewScoreWeight) {
	// 	overAllScore = chargedScore;
	// }
	// if (!chargedScoreWeight) {
	// 	overAllScore = reviewOverallScore;
	// }

	// business.rating.charged = chargedScore;
	// business.rating.overall = overAllScore;

	await business.save();

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

	const business = await Business.findById(transaction.business);
	if (!business) {
		res.status(404);
		throw new Error('Business not found');
	}

	const amountToCharge = amount ? amount * 100 : transaction.amount * 100;

	await stripe.paymentIntents.capture(
		transaction.stripe_payment_id,
		{
			amount_to_capture: amountToCharge,
		},
		{
			stripeAccount: transaction.business.stripe_account_id,
		}
	);

	const chargedAmount = amount || transaction.amount; // charge full amount if not specified a partial amount

	transaction.status = 'charged';
	transaction.closed_at = new Date();
	transaction.charged = chargedAmount;
	transaction.charged_description =
		charged_description || 'Charged full deposit';

	await transaction.save();

	const notification = await Notification.create({
		title: 'Deposit Charged',
		content: `Deposit of ${chargedAmount} ${transaction.currency.toUpperCase()} charged successfully.`,
		customer: transaction.customer,
		type: 'customer',
	});

	const customerAssociated = customers.filter(
		(ws) => ws.id === transaction.customer.toString()
	);

	if (customerAssociated.length > 0) {
		for (const ws of customerAssociated) {
			ws.send(
				JSON.stringify({
					type: 'notification',
					data: {
						notification: notification,
					},
				})
			);
			ws.send(
				JSON.stringify({
					type: 'endTransaction',
					data: {
						transaction: transaction,
					},
				})
			);
		}
	}

	if (!business.rating) {
		business.rating = {
			reviewOverall: 5,
			quality: 0,
			reliability: 0,
			price: 0,
			charged: 5,
			overall: 0,
		};
	}

	const transactionCount =
		(await Transaction.countDocuments({
			customer: transaction.customer._id,
		})) || 1;

	const chargedTransactionCount = await Transaction.countDocuments({
		customer: transaction.customer._id,
		status: 'charged',
	});

	const customerTransactionChangePercent = Math.round(
		(chargedTransactionCount / transactionCount) * 100
	);
	if (
		customerTransactionChangePercent > CHARGED_PERCENT_NOTIFICATION &&
		transactionCount > 6
	) {
		const adminNotification = await Notification.create({
			title: 'Customer Charging Notification',
			content: `Customer has been charged ${customerTransactionChangePercent}% of their ${transactionCount} deposits.`,
			customer: transaction.customer,
			type: 'admin',
		});

		for (const ws of admins) {
			ws.send(
				JSON.stringify({
					type: 'notification',
					data: {
						notification: adminNotification,
					},
				})
			);
		}
	}

	// const chargedScore = 5 - (chargedTransactionCount / transactionCount) * 5;
	// const reviewOverallScore = business.rating.reviewOverall || 5;
	// const reviewScoreWeight = reviewOverallScore * REVIEW_WEIGHT;
	// const chargedScoreWeight = chargedScore * CHARGED_WEIGHT;
	// let overAllScore = reviewScoreWeight + chargedScoreWeight;
	// if (!reviewScoreWeight && !chargedScoreWeight) {
	// 	overAllScore = 5;
	// } else if (!reviewScoreWeight) {
	// 	overAllScore = chargedScore;
	// }
	// if (!chargedScoreWeight) {
	// 	overAllScore = reviewOverallScore;
	// }

	// business.rating.charged = chargedScore;
	// business.rating.overall = overAllScore;

	await business.save();

	res.status(200).json({
		success: true,
		message: `Deposit of ${chargedAmount} ${transaction.currency.toUpperCase()} captured successfully.`,
		transaction,
	});
});

const getTransactionAdmin = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const transaction = await Transaction.findById(id)
		.populate('customer', 'name image phone')
		.populate('business', 'name image rating category');
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
	})
		.sort({ opened_at: -1 })
		.populate('business', 'name image rating category')
		.populate('customer', 'name image phone');
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
	})
		.sort({ opened_at: -1 })
		.populate('customer', 'name image phone')
		.populate('business', 'name image rating category');

	res.status(200).json({
		success: true,
		transactions,
	});
});

const getTransactionById = asyncHandler(async (req, res) => {
	const transaction = await Transaction.findById(req.params.id)
		.populate('customer', 'name image email')
		.populate('business', 'name image rating category')
		.populate('review', 'images content createdAt');

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
		(!transaction.customer ||
			transaction.customer._id.toString() !== req.customer._id.toString())
	) {
		res.status(401);
		throw new Error('Unauthorized');
	}

	if (
		req.business &&
		(!transaction.business ||
			transaction.business._id.toString() !== req.business._id.toString())
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

	const transaction = await Transaction.findById(id).populate('item');
	if (!transaction) {
		res.status(404);
		throw new Error('Transaction not found');
	}

	if (transaction.status !== 'intent') {
		res.status(400);
		throw new Error("Transaction is not in an 'intent' state");
	}

	const paymentIntent = await stripe.paymentIntents.retrieve(
		transaction.stripe_payment_id,
		{
			stripeAccount: transaction.business.stripe_account_id,
		}
	);

	if (paymentIntent.status !== 'requires_capture') {
		res.status(400);
		throw new Error(
			`PaymentIntent not ready for capture. Status: ${paymentIntent.status}`
		);
	}

	const businessAssociated = businesses.filter(
		(ws) => ws.id === transaction.business.toString()
	);

	if (businessAssociated.length > 0) {
		for (const ws of businessAssociated) {
			ws.send(
				JSON.stringify({
					type: 'newTransaction',
					data: {
						item: transaction.item,
					},
				})
			);
		}
	}

	if (transaction.item.temporary) {
		await Item.findByIdAndDelete(transaction.item._id);
		transaction.item = null;
	}

	transaction.status = 'open';
	await transaction.save();

	const qrCodeLink = `${req.protocol}://${req.get(
		'host'
	)}/api/transaction/qr/${transaction._id}`; // Or use a QR lib to generate a Data URI

	const plainText = `
🔔 New Transaction Opened

Your transaction has been successfully opened.

Transaction Details:
- Description: ${transaction.description}
- Amount: ${transaction.amount} ${transaction.currency.toUpperCase()}
- Stripe Payment ID: ${transaction.stripe_payment_id}
- Opened At: ${new Date(transaction.opened_at).toLocaleString()}
${
	transaction.return_date
		? `- Return Date: ${new Date(transaction.return_date).toLocaleString()}`
		: ''
}

To continue, scan or show your QR code at the business location.

QR Code: ${qrCodeLink}

Thank you,
SecuRent Team
`;

	const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1e3a8a;">
    <h2 style="color: #1e3a8a;">🔔 New Transaction Opened</h2>
    <p>Hello,</p>
    <p>Your transaction has been successfully opened. When you return the item the business can scan the QR code to view the transaction details:</p>

    <div style="text-align: center; margin: 20px 0;">
      <img src="${qrCodeLink}" alt="QR Code" style="width: 180px; height: 180px;" />
    </div>

    <h3 style="color: #1e3a8a;">Transaction Details</h3>
    <ul style="padding-left: 16px; color: #1e3a8a;">
      <li><strong>Status:</strong> ${transaction.status}</li>
      <li><strong>Description:</strong> ${transaction.description}</li>
      <li><strong>Amount:</strong> ${
			transaction.amount
		} ${transaction.currency.toUpperCase()}</li>
      <li><strong>Opened At:</strong> ${new Date(
			transaction.opened_at
		).toLocaleString()}</li>
      ${
			transaction.return_date
				? `<li><strong>Return Date:</strong> ${new Date(
						transaction.return_date
				  ).toLocaleString()}</li>`
				: ''
		}
    </ul>

    <p>If you have any questions, please reply to this email or contact our support team.</p>

    <p>Thank you,<br/>The <strong>SecuRent</strong> Team</p>
  </div>
`;

	await sendEmail(req.customer.email, 'New Transaction', plainText, html);

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

	if (transaction.item) {
		await Item.findByIdAndDelete(transaction.item);
	}

	await transaction.deleteOne();

	res.status(200).json({
		success: true,
		message: 'Transaction deleted successfully',
	});
});

const getTransactionQRCodeImage = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const transaction = await Transaction.findById(id);
	if (!transaction) {
		res.status(404);
		throw new Error('Transaction not found');
	}

	if (transaction.status === 'intent') {
		res.status(400);
		throw new Error("Transaction is in 'intent' state");
	}
	// Generate the QR code here and return it as an image

	const qrData = `${APP_URL}${TRANSACTION_NAME}-${transaction._id}`;

	try {
		const qrImage = await QRCode.toBuffer(qrData, {
			type: 'png',
			errorCorrectionLevel: 'H',
			width: 300,
		});

		res.setHeader('Content-Type', 'image/png');
		res.setHeader(
			'Content-Disposition',
			`inline; filename="transaction-${transaction._id}.png"`
		);
		res.send(qrImage);
	} catch (err) {
		res.status(500);
		throw new Error('Failed to generate QR code');
	}
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
	getTransactionQRCodeImage,
};
