import { ca } from 'react-native-paper-dates';
import { checkToken, client } from './httpClient';
import { Transaction } from './interfaceService';

// In ReviewService.ts
const createReview = async (
	transactionId: string,
	content: string,
	images?: File[]
) => {
	const accessToken = await checkToken();
	if (!accessToken) {
		throw new Error('No access token available');
	}

	try {
		console.log('Creating review with transaction:', transactionId);
		if (images && images.length > 0) {
			const formData = new FormData();
			formData.append('transaction', transactionId); // Make sure this matches the server expectation
			formData.append('content', content);

			images.forEach((image) => {
				formData.append('images', image);
			});

			const response = await client.post('/review', formData, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'multipart/form-data',
				},
			});
			return response.data;
		} else {
			const response = await client.post(
				'/review',
				{
					transaction: transactionId, // Make sure this matches the server expectation
					content,
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			return response.data;
		}
	} catch (error: any) {
		console.error(
			'Error creating review:',
			error.response?.data || error.message
		);
		throw new Error(
			error.response?.data?.message || 'Failed to create review'
		);
	}
};

export { createReview };
