import mongoose from 'mongoose';

const adminScheme = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			required: true,
			default: 'Admin',
		},
		isVerified: {
			type: Boolean,
			default: true,
		},
		image: {
			type: String,
		},
		refreshTokens: [
			{
				token: {
					type: String,
					required: true,
				},
				unique: {
					type: String,
				},
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model('Admin', adminScheme);
