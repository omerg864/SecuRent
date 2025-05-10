import ShowToast from '@/components/ui/ShowToast';
import { client, checkToken } from './httpClient';

const createReport = async (
	businessId: string,
	content: string,
	image?: File
) => {
	const accessToken = await checkToken();
	if (!accessToken) {
		throw new Error('No access token available');
	}

	try {
		console.log('Creating a report ⚠️');
		if (image) {
			const formData = new FormData();
			formData.append('businessId', businessId);
			formData.append('content', content);
			formData.append('image', image);

			const response = await client.post('/report', formData, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'multipart/form-data',
				},
			});
			ShowToast('success', 'Report has been sent!');
			return response.data;
		} else {
			const response = await client.post(
				'/report',
				{
					businessId: businessId,
					content: content,
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			ShowToast('success', 'Report has been sent!');
			return response.data;
		}
	} catch (error: any) {
		console.error(
			'Error creating report:',
			error.response?.data || error.message
		);
		throw new Error(
			error.response?.data?.message || 'Failed to create report'
		);
	}
};

export { createReport };
