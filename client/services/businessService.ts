import { buildFormData } from '@/utils/functions';
import { checkToken, client } from './httpClient';
import {
	AuthData,
	AuthResponse,
	Business,
	StepResponse,
	ValidResponse,
} from './interfaceService';
import { FileObject } from '@/types/business';

const registerBusiness = async (
	businessData: AuthData,
	file: FileObject | null
) => {
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

const verifyBankDetails = async () => {
	try {
		const accessToken = await checkToken();
		const response = await client.get<ValidResponse>(
			'business/verify-bank',
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

const getStripeOnboardingLink = async () => {
	try {
		const accessToken = await checkToken();
		const response = await client.get<{ url: string }>(
			'business/stripe-onboarding',
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
		return response;
	} catch (error) {
		throw error || 'Failed to get Stripe onboarding link.';
	}
};

const getNearestBusinesses = async (
	lat: number,
	lng: number,
	radius = 10,
	rating = 0,
	category = 'all',
	search = ''
) => {
	try {
		const accessToken = await checkToken();
		const response = await client.get<{
			success: boolean;
			businesses: Business[];
		}>(
			`business/nearby?lat=${lat}&lng=${lng}&radius=${radius}&rating=${rating}&category=${encodeURIComponent(
				category
			)}&search=${encodeURIComponent(search)}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
		return response.data.businesses; // Notice: we return the businesses array
	} catch (error) {
		throw error || 'Failed to get nearest businesses.';
	}
};

export {
	registerBusiness,
	verifyEmailBusiness,
	verifyBankDetails,
	updateBusinessPassword,
	resendBusinessVerificationCode,
	updateBusinessDetails,
	getStripeOnboardingLink,
	getNearestBusinesses,
};
