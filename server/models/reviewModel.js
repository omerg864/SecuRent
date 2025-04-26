import mongoose from 'mongoose';

const ReviewSchema = mongoose.Schema(
	{
		transaction: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Transaction',
			required: true,
		},
		business: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Business',
			required: true,
		},
		images: {
			type: [String],
		},
		customer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Customer',
			required: true,
		},
		rating: {
			type: {
				overall: { type: Number, default: 0 },
				quality: { type: Number, default: 0 },
				reliability: { type: Number, default: 0 },
				price: { type: Number, default: 0 },
			},
		},
		content: {
			type: String,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Review', ReviewSchema);
