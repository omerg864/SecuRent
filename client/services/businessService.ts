import { checkToken, client } from './httpClient';
import { AuthData, AuthResponse } from './interfaceService';
import { BankDetails } from './interfaceService';

const registerBusiness = async (businessData: AuthData) => {
	try {
		const response = await client.post<AuthResponse>(
			'business/register',
			businessData
		);
		return response.data.success;
	} catch (error) {
		throw error || 'Registration failed.';
	}
};

const verifyCompanyNumber = async (companyNumber: string) => {
	try {
		const accessToken = await checkToken();
		if (!accessToken) {
			throw new Error('Access token is missing or invalid.');
		}
		const response = await client.post<AuthResponse>(
			'business/verify-company-number',
			{ companyNumber },
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
		return response;
	} catch (error: any) {
		throw error || 'Company number verification failed.';
	}
};

const verifyEmailBusiness = async (code: string, userId: string) => {
  try {
    const response = await client.post<AuthResponse>(
      "business/verify-email",
      { code , userId }
    );
    return response.data;
  } catch (error) {
    throw error || "Email verification failed.";
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
      "business/resend-code",
      { userId }
    );
    return response.data.success;
  } catch (error) {
    throw error || "Resend verification code failed.";
  }
}

export {
	registerBusiness,
	verifyCompanyNumber,
	verifyEmailBusiness,
	updateBankDetails,
	updateBusinessPassword,
	resendBusinessVerificationCode
};
