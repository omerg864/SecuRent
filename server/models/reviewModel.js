import mongoose from 'mongoose';

const ReviewSchema = mongoose.Schema(
	{
		business: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Business',
			required: true,
		},
		customer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Customer',
			required: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		content: {
			type: String,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Review', ReviewSchema);
