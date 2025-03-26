import { client } from './httpClient';
import {
	AuthData,
	AuthResponse,
	LoginCredentials,
	CustomerLoginResponse,
	CreditCardData,
} from './interfaceService';
import { checkToken } from './httpClient';

const registerCustomer = async (businessData: AuthData) => {
	try {
		const response = await client.post<AuthResponse>(
			'customer/register',
			businessData
		);
		return response.data.success;
	} catch (error) {
		throw error || 'Registration failed.';
	}
};

const loginCustomer = async (loginCredentials: LoginCredentials) => {
	try {
		const response = await client.post<CustomerLoginResponse>(
			'customer/login',
			loginCredentials
		);
		return response.data;
	} catch (error) {
		throw error || 'Login failed.';
	}
};

const updateCreditCard = async (creditCardData: CreditCardData) => {
	try {
		console.log(creditCardData);
		const accessToken = await checkToken();
		const response = await client.put<AuthResponse>(
			'customer/update/credit-card',
			creditCardData,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
		return response;
	} catch (error) {
		throw error || 'Credit card update failed.';
	}
};

export { registerCustomer, loginCustomer, updateCreditCard };
