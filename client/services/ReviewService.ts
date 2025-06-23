import { checkToken, client } from './httpClient';
import { ReviewResponse } from './interfaceService';

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
			formData.append('transaction', transactionId);
			formData.append('content', content);
			images.forEach((image) => {
				formData.append('images', image);
			});

			const response = await client.post<ReviewResponse>('/review', formData, {
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
					transaction: transactionId,
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
