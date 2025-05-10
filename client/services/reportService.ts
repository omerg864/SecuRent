import ShowToast from '@/components/ui/ShowToast';
import { client, checkToken } from './httpClient';

const createReport = async (
	businessId: string,
	title: string,
	content: string,
	images?: File[]
) => {
	const accessToken = await checkToken();
	if (!accessToken) {
		throw new Error('No access token available');
	}
	try {
		console.log('Creating review with transaction:', businessId);
		if (images && images.length > 0) {
			const formData = new FormData();
			formData.append('businessId', businessId);
			formData.append('content', content);
			formData.append('title', title);
			images.forEach((image) => {
				formData.append('images', image);
			});
			const response = await client.post('/report', formData, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'multipart/form-data',
				},
			});
			ShowToast('success', 'Report Submitted!');
			return response.data;
		} else {
			const response = await client.post(
				'/report',
				{
					businessId: businessId,
					content,
					title,
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			ShowToast('success', 'Report Submitted!');
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
