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
		const response = await client.get(
			`admin/get-all-businesses?page=${page}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
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
		console.log(
			'Get business transactions response: ',
			response.data.transactions
		);
		return response.data;
	} catch (error) {
		console.log('Get business transactions error: ', error);
		throw new Error(
			error.response?.data?.message || 'Get business transactions failed'
		);
	}
};

const getCustomerTransactions = async (customerId) => {
	try {
		const accessToken = await checkToken();
		if (!accessToken) {
			throw new Error('Access token is missing or invalid.');
		}
		const response = await client.get(
			`transaction/admin/customer/${customerId}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
		console.log('Get customer transactions response: ', response.data);
		return response.data;
	} catch (error) {
		console.log('Get customer transactions error: ', error);
		throw new Error(
			error.response?.data?.message || 'Get customer transactions failed'
		);
	}
};

const getAllCustomers = async (page, name = '') => {
	try {
		const accessToken = await checkToken();
		if (!accessToken) {
			throw new Error('Access token is missing or invalid.');
		}
		if (name) {
			const response = await client.get(
				`admin/get-all-customers?page=${page}&name=${name}`,
				{
					headers: { Authorization: `Bearer ${accessToken}` },
				}
			);
			return response.data;
		}
		const response = await client.get(
			`admin/get-all-customers?page=${page}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
		console.log('Get all customers response: ', response.data);
		return response.data;
	} catch (error) {
		console.log('Get all customers error: ', error);
		throw new Error(
			error.response?.data?.message || 'Get all customers failed'
		);
	}
};

const getCustomerReviews = async (customerId) => {
	try {
		const accessToken = await checkToken();
		if (!accessToken) {
			throw new Error('Access token is missing or invalid.');
		}
		const response = await client.get(`review/customer/${customerId}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		console.log('Get customer reviews response: ', response.data);
		return response.data;
	} catch (error) {
		console.log('Get customer reviews error: ', error);
		throw new Error(
			error.response?.data?.message || 'Get customer reviews failed'
		);
	}
};
const getCustomerReports = async (customerId) => {
	try {
		const accessToken = await checkToken();
		if (!accessToken) {
			throw new Error('Access token is missing or invalid.');
		}
		const response = await client.get(`report/customer/${customerId}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		console.log('Get customer reports response: ', response.data);
		return response.data;
	} catch (error) {
		console.log('Get customer reports error: ', error);
		throw new Error(
			error.response?.data?.message || 'Get customer reports failed'
		);
	}
};

const getBusinessReports = async (businessId) => {
	try {
		const accessToken = await checkToken();
		if (!accessToken) {
			throw new Error('Access token is missing or invalid.');
		}
		const response = await client.get(`report/business/${businessId}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		console.log('Get business reports response: ', response.data);
		return response.data;
	} catch (error) {
		console.log('Get business reports error: ', error);
		throw new Error(
			error.response?.data?.message || 'Get business reports failed'
		);
	}
};

const getBusinessReviews = async (businessId) => {
	try {
		const accessToken = await checkToken();
		if (!accessToken) {
			throw new Error('Access token is missing or invalid.');
		}
		const response = await client.get(`review/business/${businessId}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		console.log('Get business reviews response: ', response.data);
		return response.data;
	} catch (error) {
		console.log('Get business reviews error: ', error);
		throw new Error(
			error.response?.data?.message || 'Get business reviews failed'
		);
	}
};

const toggleBusinessSuspension = async (businessId) => {
	try {
		const accessToken = await checkToken();
		if (!accessToken)
			throw new Error('Access token is missing or invalid.');

		const response = await client.put(
			`admin/suspend/business/${businessId}`,
			{},
			{ headers: { Authorization: `Bearer ${accessToken}` } }
		);
		return response.data;
	} catch (error) {
		console.error('Toggle business suspension error: ', error);
		throw new Error(
			error.response?.data?.message || 'Failed to toggle suspension'
		);
	}
};

const toggleCustomerSuspension = async (id) => {
	try {
		const accessToken = await checkToken();
		if (!accessToken)
			throw new Error('Access token is missing or invalid.');

		const response = await client.put(
			`admin/suspend/customer/${id}`,
			{},
			{ headers: { Authorization: `Bearer ${accessToken}` } }
		);
		return response.data;
	} catch (error) {
		console.error('Toggle business suspension error: ', error);
		throw new Error(
			error.response?.data?.message || 'Failed to toggle suspension'
		);
	}
};

const getAdminByEmail = async (email) => {
	try {
		const accessToken = await checkToken();
		if (!accessToken) {
			throw new Error('Access token is missing or invalid.');
		}
		const response = await client.get(`admin/getByEmail/${email}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		return response.data;
	} catch (error) {
		console.error('Get admin by Email error: ', error);
		throw new Error(
			error.response?.data?.message || 'Failed to get admin by Email'
		);
	}
};

const getAllResolvedReportsByAdminId = async (adminId) => {
	try {
		const accessToken = await checkToken();
		if (!accessToken) {
			throw new Error('Access token is missing or invalid.');
		}
		const response = await client.get(`report/admin/${adminId}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		return response.data;
	} catch (error) {
		console.log('Get access token error: ', error);
		throw new Error('Failed to get access token');
	}
};

const updateAdmin = async ({
	name,
	email,
	imageFile,
	imageDeleteFlag = false,
}) => {
	try {
		const accessToken = await checkToken();
		if (!accessToken) {
			throw new Error('Access token is missing or invalid.');
		}
		const formData = new FormData();

		if (name) formData.append('name', name);
		if (email) formData.append('email', email);
		if (imageFile) formData.append('Image', imageFile);
		if (imageDeleteFlag) formData.append('imageDeleteFlag', 'true');

		const { data } = await client.put('/admin/update', formData, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'multipart/form-data',
			},
		});

		return data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message || 'Failed to update admin profile'
		);
	}
};

export {
	register,
	login,
	googleLogin,
	analytics,
	getAllBusinesses,
	getBusinessTransactions,
	getAllCustomers,
	getCustomerTransactions,
	getCustomerReviews,
	getCustomerReports,
	getBusinessReports,
	getBusinessReviews,
	toggleBusinessSuspension,
	toggleCustomerSuspension,
	getAdminByEmail,
	getAllResolvedReportsByAdminId,
	updateAdmin,
};
