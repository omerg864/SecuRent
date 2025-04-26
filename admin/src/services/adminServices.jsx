import axios from 'axios';
import { checkToken, client, setAuthToken } from './httpClient';

const googleLogin = async (code) => {
	try {
		const response = await client.post('admin/google', { code });

		localStorage.setItem('Access_Token', response.data.accessToken);
		localStorage.setItem('Refresh_Token', response.data.refreshToken);

		const expiration = new Date();
		expiration.setHours(expiration.getHours() + 23);
		localStorage.setItem('Auth_Expiration', expiration.toISOString());

		localStorage.setItem('user', JSON.stringify(response.data.admin));

		setAuthToken(response.data.accessToken);

		return response.data.admin;
	} catch (error) {
		console.log('Google login error: ', error);
		throw new Error(error.response?.data?.message || 'Google login failed');
	}
};

const login = async (email, password) => {
	try {
		const response = await client.post('admin/login', { email, password });

		localStorage.setItem('Access_Token', response.data.accessToken);
		localStorage.setItem('Refresh_Token', response.data.refreshToken);

		const expiration = new Date();
		expiration.setHours(expiration.getHours() + 23);
		localStorage.setItem('Auth_Expiration', expiration.toISOString());

		localStorage.setItem('user', JSON.stringify(response.data.user));

		setAuthToken(response.data.accessToken);

		return response.data.admin; // Return user info
	} catch (error) {
		console.log('Login error: ', error);
		throw new Error(error.response?.data?.message || 'Login failed');
	}
};

const register = async (adminData) => {
	try {
		const response = await client.post('admin/register', adminData);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			console.log('Server Error: ', error.response.data);
			throw new Error(error.response.data.message || 'Server error');
		}
		console.log('Unknown Error:', error);
		throw new Error('An error occurred during registration');
	}
};

const analytics = async () => {
	try {
		const accessToken = await checkToken();
		if (!accessToken) {
			throw new Error('Access token is missing or invalid.');
		}
		const response = await client.get('admin/analytics', {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		return response.data;
	} catch (error) {
		console.log('Analytics error: ', error);
		throw new Error(
			error.response?.data?.message || 'Analytics fetch failed'
		);
	}
};

const getAllBusinesses = async (page, name = '') => {
	try {
		const accessToken = await checkToken();
		if (!accessToken) {
			throw new Error('Access token is missing or invalid.');
		}
		if (name) {
			const response = await client.get(
				`admin/get-all-businesses?page=${page}&name=${name}`,
				{
					headers: { Authorization: `Bearer ${accessToken}` },
				}
			);
			return response.data;
		}
		const response = await client.get(`admin/get-all-businesses?page=${page}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		return response.data;
	} catch (error) {
		console.log('Get all businesses error: ', error);
		throw new Error(
			error.response?.data?.message || 'Get all businesses failed'
		);
	}
};

const getBusinessTransactions = async (businessId) => {
	try {
		const accessToken = await checkToken();
		if (!accessToken) {
			throw new Error('Access token is missing or invalid.');
		}
		const response = await client.get(
			`transaction/admin/business/${businessId}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
		return response.data;
	} catch (error) {
		console.log('Get business transactions error: ', error);
		throw new Error(
			error.response?.data?.message || 'Get business transactions failed'
		);
	}
}

export { register, login, googleLogin, analytics , getAllBusinesses , getBusinessTransactions };
