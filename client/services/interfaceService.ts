import { Business } from '@/types/business';
import { Customer } from '@/types/customer';
import { Item } from '@/types/item';
import { Report } from '@/types/report';
import { Review } from '@/types/review';
import { Transaction } from '@/types/transaction';
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

interface SuccessResponse {
	success: boolean;
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

interface CustomerResponse {
	success: boolean;
	customer: Customer;
}

interface BusinessResponse {
	success: boolean;
	business: Business;
}

interface BusinessesResponse {
	success: boolean;
	businesses: Business[];
}

interface ReportResponse {
	success: boolean;
	report: Report;
}

interface ReviewResponse {
	success: boolean;
	review: Review;
}

interface ChargeDepositPayload {
	amount: number;
	charged_description: string;
}

interface TransactionResponse {
	success: boolean;
	transaction: Transaction;
}

interface TransactionsResponse {
	success: boolean;
	transactions: Transaction[];
}

interface LocationPrediction {
	id: string;
	description: string;
}

interface LocationDetails {
	address: string;
	location: { lat: number; lng: number };
}

interface ItemResponse {
	success: boolean;
	item: Item;
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
	SuccessResponse,
	BusinessLoginResponse,
	CustomerLoginResponse,
	CustomerResponse,
	BusinessesResponse,
	BusinessResponse,
	LoginResponse,
	ChargeDepositPayload,
	TransactionResponse,
	TransactionsResponse,
	LocationPrediction,
	LocationDetails,
	StepResponse,
	ClientStripeParamsResponse,
	ValidResponse,
	TransactionIntentResponse,
	BusinessDetails,
	ItemResponse,
	ReportResponse,
	ReviewResponse
};
