import mongoose from 'mongoose';

const businessScheme = mongoose.Schema({
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
	phone: {
		type: String,
	},
	category: [String],
	role: {
		type: String,
		required: true,
		default: 'Business',
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
	rating: {
		type: Number,
	},
	address: {
		type: String,
	},
	image: {
		type: String,
	},
	currency: {
		type: String,
	},
	verificationCode: {
		type: String,
	},
	isValid: {
		type: Boolean,
		default: false,
	},
	isEmailValid: {
		type: Boolean,
		default: false,
	},
	isBankValid: {
		type: Boolean,
		default: false,
	},
	companyNumber: {
		type: String,
	},
	isCompanyNumberVerified: {
		type: Boolean,
		default: false,
	},
	bank : {
		type: Object,
	}
});
export default mongoose.model('Business', businessScheme);