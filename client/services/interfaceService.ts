import { Business } from '@/types/business';
import { Customer } from '@/types/customer';
interface AuthData {
	name?: string;
	email?: string;
	password?: string;
}

interface LoginCredentials {
	email: string;
	password: string;
}

interface AuthResponse {
	success: boolean;
	message: string;
}

interface ValidResponse {
	success: boolean;
	message: string;
	valid: boolean;
}

interface ClientStripeParamsResponse {
	clientSecret: string;
	success: boolean;
	customer_stripe_id: string;
	ephemeralKey: string;
}

interface TransactionIntentResponse {
	clientSecret: string;
	success: boolean;
	customer_stripe_id: string;
	ephemeralKey: string;
	transactionId: string;
	return_date: any;
}

interface StepResponse {
	success: boolean;
	message: string;
	valid: boolean;
}

interface BusinessLoginResponse {
	success: boolean;
	accessToken: string;
	refreshToken: string;
	user: Business;
}

interface CustomerLoginResponse {
	success: boolean;
	accessToken: string;
	refreshToken: string;
	user: Customer;
}

type LoginResponse = CustomerLoginResponse | BusinessLoginResponse;

interface CreditCardData {
	number: string;
	expiry: string;
	cvv: string;
	cardHolderName: string;
}

interface BankDetails {
	accountNumber: string;
	sortCode: string;
	accountHolderName: string;
	bankName: string;
}

interface Item {
	_id: string;
	business: string;
	description: string;
	price: number;
	currency: string;
	image?: string;
	return_date?: string | null;
	duration?: number | null;
	timeUnit?: 'days' | 'minutes' | 'hours';
	temporary?: boolean;
	createdAt?: string | Date;
	updatedAt?: string | Date;
}

interface ChargeDepositPayload {
	amount: number;
	charged_description: string;
}

interface TransactionResponse {
	success: boolean;
	transaction: {
		_id: string;
		transaction_id: string;
		amount: number;
		currency: string;
		status: string;
		business: string;
		customer?: string;
		closed_at?: string;
		return_date?: string;
		charged?: number;
		charged_description?: string;
		createdAt: string;
		updatedAt: string;
	};
}

interface Transaction {
	_id: string;
	transaction_id?: string;
	amount: number;
	description: string;
	currency: string;
	status: string;
	business?: {
		_id?: string;
		name?: string;
		image?: string;
	};
	customer?: {
		_id: string;
		name: string;
		image?: string;
		phone?: string;
	};
	opened_at?: Date;
	closed_at?: Date;
	return_date?: Date;
	charged?: number;
	charged_description?: string;
	createdAt: string;
	updatedAt: string;
	review?: {
		_id?: string;
		image?: string[];
		content?: string;
		createdAt: string;
	};
}

interface LocationPrediction {
	id: string;
	description: string;
}

interface LocationDetails {
	address: string;
	location: { lat: number; lng: number };
}

interface Review {
	_id: string;
	transaction: string;
	business: string;
	customer: string;
	images?: string[];
	rating: {
		overall: number;
		reliability: number;
		price: number;
		quality: number;
	};
	content?: string;
	createdAt: Date;
	updatedAt: Date;
}

interface BusinessDetails {
	business: Business;
	items: Item[];
	reviews: Review[];
}

export type {
	AuthData,
	LoginCredentials,
	AuthResponse,
	BusinessLoginResponse,
	CustomerLoginResponse,
	CreditCardData,
	LoginResponse,
	BankDetails,
	Item,
	ChargeDepositPayload,
	TransactionResponse,
	Transaction,
	LocationPrediction,
	LocationDetails,
	StepResponse,
	ClientStripeParamsResponse,
	ValidResponse,
	TransactionIntentResponse,
	Review,
	BusinessDetails,
};
