import { buildFormData } from '@/utils/functions';
import { checkToken, client } from './httpClient';
import {
	AuthData,
	AuthResponse,
	Business,
	StepResponse,
} from './interfaceService';
import { BankDetails } from './interfaceService';

const registerBusiness = async (businessData: AuthData, file: File | null) => {
	try {
		const formData = buildFormData(businessData, file);
		const response = await client.post<AuthResponse>(
			'business/register',
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

const updateBusinessDetails = async (businessData: Partial<Business>) => {
	try {
		const accessToken = await checkToken();
		if (!accessToken) {
			throw new Error('Access token is missing or invalid.');
		}
		console.log('Business data:', businessData);
		const response = await client.put<StepResponse>(
			'business/',
			businessData,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		throw error || 'Business details update failed.';
	}
};

const verifyEmailBusiness = async (code: string, userId: string) => {
	try {
		const response = await client.post<AuthResponse>(
			'business/verify-email',
			{ code, userId }
		);
		return response.data;
	} catch (error) {
		throw error || 'Email verification failed.';
	}
};

const updateBankDetails = async (bankDetails: BankDetails) => {
	try {
		const accessToken = await checkToken();
		const response = await client.post<AuthResponse>(
			'business/verify-bank',
			bankDetails,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
		return response.data.success;
	} catch (error) {
		throw error || 'Email verification failed.';
	}
};

const updateBusinessPassword = async (newPassword: string) => {
	try {
		const accessToken = await checkToken();
		const response = await client.put<AuthResponse>(
			'business/update-password',
			{ newPassword },
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
		console.log('Here' + response.data.success);
		return response.data.success;
	} catch (error) {
		throw error || 'Password update failed.';
	}
};

const resendBusinessVerificationCode = async (userId: string) => {
	try {
		const response = await client.post<AuthResponse>(
			'business/resend-code',
			{ userId }
		);
		return response.data.success;
	} catch (error) {
		throw error || 'Resend verification code failed.';
	}
};

export {
	registerBusiness,
	verifyEmailBusiness,
	updateBankDetails,
	updateBusinessPassword,
	resendBusinessVerificationCode,
	updateBusinessDetails,
};
