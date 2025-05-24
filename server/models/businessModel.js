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
		type: {
			reviewOverall: { type: Number },
			quality: { type: Number },
			reliability: { type: Number },
			price: { type: Number },
			charged: { type: Number },
			overall: { type: Number },
		},
		required: true,
		default: {
			reviewOverall: 0,
			quality: 0,
			reliability: 0,
			price: 0,
			charged: 0,
			overall: 5,
		},
	},
	address: {
		type: String,
	},
	location: {
		type: {
			type: String, // This must be "Point"
			enum: ['Point'],
			required: true,
			default: 'Point',
		},
		coordinates: {
			type: [Number], // [longitude, latitude]
			required: true,
			default: [0, 0],
		},
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
	reviewSummary: {
		type: String,
		default: '',
	},
	insights: {
		type: {
			quality: { type: String, default: '' },
			reliability: { type: String, default: '' },
			price: { type: String, default: '' },
		},
	},
	stripe_account_id: {
		type: String,
	},
	suspended: {
		type: Boolean,
		default: false,
	},
	activated: {
		type: Boolean,
		default: true,
	},
});

businessScheme.index({ location: '2dsphere' });
export default mongoose.model('Business', businessScheme);
