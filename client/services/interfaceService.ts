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

interface BusinessLoginResponse {
	success: boolean;
	accessToken: string;
	refreshToken: string;
	user: {
		id: string;
		name: string;
		email: string;
		phone: string;
		address: string;
		image: string;
		rating: number;
		role: string;
		category: string[];
		currency: string;
		verificationCode: string;
		isValid: boolean;
		isEmailValid: boolean;
		isBankValid: boolean;
		companyNumber: string;
		isCompanyNumberVerified: boolean;
		bank: {
			accountNumber: string;
			sortCode: string;
			accountHolderName: string;
			bankName: string;
		};
	};
}

interface CustomerLoginResponse {
	success: boolean;
	accessToken: string;
	refreshToken: string;
	user: {
		id: string;
		name: string;
		email: string;
		phone: string;
		address: string;
		image: string;
		rating: number;
		role: string;
		currency: string;
		verificationCode: string;
		isValid: boolean;
		isEmailValid: boolean;
		isPaymentValid: boolean;
		creditCard: {
			number: string;
			expiry: string;
			cvv: string;
			cardHolderName: string;
		};
	};
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
	description: string;
	date: Date;
	price: number;
	temporary: boolean;
	business: string;
	currency: string;
	createdAt: Date;
	updatedAt: Date;
	image: string;
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
};
