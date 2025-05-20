import { client } from './httpClient';
import {
	AuthData,
	AuthResponse,
	ClientStripeParamsResponse,
	CustomerResponse
} from './interfaceService';
import { checkToken } from './httpClient';
import { buildFormData } from '@/utils/functions';
import { FileObject } from '@/types/business';
import { AxiosResponse } from 'axios';
import { Customer } from '@/types/customer';

const registerCustomer = async (
	customerData: AuthData,
	file: FileObject | null
) => {
	try {
		const formData = buildFormData(customerData, file);
		console.log('Form data:', formData);
		const response = await client.post<AuthResponse>(
			'customer/register',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);
		return response.data.success;
	} catch (error) {
		throw error || 'Registration failed.';
	}
};

const customerCardIntent = async (): Promise<
	AxiosResponse<ClientStripeParamsResponse, any>
> => {
	try {
		const accessToken = await checkToken();
		const response = await client.put<ClientStripeParamsResponse>(
			'customer/credit-card/intent',
			{},
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
		return response;
	} catch (error) {
		throw error || 'Credit card update failed.';
	}
};

const updateCreditCard = async () => {
	try {
		const accessToken = await checkToken();
		const response = await client.put<AuthResponse>(
			'customer/update/credit-card',
			{},
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
		return response;
	} catch (error) {
		throw error || 'Credit card update failed.';
	}
};

const verifyEmailCustomer = async (code: string, userId: string) => {
	try {
		const response = await client.post<AuthResponse>(
			'customer/verify-email',
			{ code, userId }
		);
		return response.data;
	} catch (error) {
		throw error || 'Email verification failed.';
	}
};

const updateCustomerPassword = async (newPassword: string) => {
	try {
		const accessToken = await checkToken();
		const response = await client.put<AuthResponse>(
			'customer/update-password',
			{ newPassword },
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
		return response.data.success;
	} catch (error) {
		throw error || 'Password update failed.';
	}
};

const resendCustomerVerificationCode = async (userId: string) => {
	try {
		const response = await client.post<AuthResponse>(
			'customer/resend-code',
			{ userId }
		);
		return response.data.success;
	} catch (error) {
		throw error || 'Resending verification code failed.';
	}
};

const getCustomerData = async () => {
	try {
		const accessToken = await checkToken();
		const response = await client.get<CustomerResponse>('customer/me', {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		return response.data;
	} catch (error) {
		throw error || 'Fetching customer data failed.';
	}
};

export {
	registerCustomer,
	updateCreditCard,
	verifyEmailCustomer,
	updateCustomerPassword,
	resendCustomerVerificationCode,
	customerCardIntent,
	getCustomerData,
};
