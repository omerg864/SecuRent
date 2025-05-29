import { checkToken, client } from './httpClient';

const getCustomerById = async (id) => {
	try {
		console.log('Customer ID: ', id);
		const accessToken = await checkToken();
		if (!accessToken) {
			throw new Error('Access token is missing or invalid.');
		}
		const response = await client.get(`customer/${id}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		console.log('Get customer by ID response: ', response.data.customer);
		return response.data.customer;
	} catch (error) {
		console.log('Get customer by ID error: ', error);
		throw new Error(
			error.response?.data?.message || 'Get customer by ID failed'
		);
	}
};

export { getCustomerById };
