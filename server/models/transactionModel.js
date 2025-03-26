import mongoose from 'mongoose';

const transactionScheme = mongoose.Schema(
	{
		transaction_id: {
			type: String,
		},
		amount: {
			type: Number,
			required: true,
		},
		currency: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
		business: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Business',
			required: true,
		},
		customer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Customer',
		},
		closed_at: {
			type: Date,
		},
		return_date: {
			type: Date,
		},
		charged: {
			type: Number,
		},
		charged_description: {
			type: String,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Transaction', transactionScheme);
