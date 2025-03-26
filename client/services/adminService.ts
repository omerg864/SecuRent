import { client } from './httpClient';
import { LoginResponse } from './interfaceService';

const LoginUser = async (token: string) => {
	try {
		const response = await client.post<LoginResponse>(
			'admin/login/client',
			{ token }
		);
		return response.data;
	} catch (error) {
		throw error || 'Login failed.';
	}
};

export { LoginUser };
