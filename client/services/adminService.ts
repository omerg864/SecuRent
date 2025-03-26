import { client } from './httpClient';
import { checkToken } from './httpClient';
import { GoogleLoginResponse } from './interfaceService';

const googleLogin = async (token: string) => {
	try {
		const response = await client.post<GoogleLoginResponse>(
			'admin/google-login/client',
			{ token }
		);
		return response.data;
	} catch (error) {
		throw error || 'Login failed.';
	}
};

export { googleLogin };
