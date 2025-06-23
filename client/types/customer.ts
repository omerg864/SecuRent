export interface Customer {
	_id: string;
	name: string;
	email: string;
	phone?: string;
	address?: string;
	image?: string;
	rating?: number;
	role: string;
	isValid: boolean;
	isEmailValid: boolean;
	isPaymentValid: boolean;
	suspended: boolean;
	createdAt: string;
	updatedAt: string;
}
