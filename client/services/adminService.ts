import { client } from './httpClient';
import { LoginResponse } from './interfaceService';

const LoginUser = async (email: string, password: string) => {
	try {
		const response = await client.post<LoginResponse>(
			'admin/login/client',
			{ email, password }
		);
		return response.data;
	} catch (error: any) {
		throw error || 'Login failed.';
	}
};

export { LoginUser };
