import { FileObject } from '@/types/business';
import { checkToken, client } from './httpClient';
import { Item } from './interfaceService';
import { buildFormData } from '@/utils/functions';

const createTemporaryItem = async (
	description: string,
	date: Date,
	price: number
) => {
	try {
		const accessToken = await checkToken();
		const response = await client.post<{ item: Item; success: boolean }>(
			'item',
			{
				temporary: true,
				description,
				date,
				price,
			},
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
		return response.data;
	} catch (error) {
		throw error || 'Temporary item creation failed.';
	}
};

const createBusinessItem = async (
	description: string,
	price: number,
	duration: number,
	timeUnit: string,
	file: FileObject | null = null
) => {
	try {
		const accessToken = await checkToken();
		const formData = buildFormData(
			{
				description,
				price,
				duration,
				timeUnit,
			},
			file
		);
		const response = await client.post<{ item: Item; success: boolean }>(
			'item',
			formData,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'multipart/form-data',
				},
			}
		);
		return response.data;
	} catch (error) {
		throw error || 'Temporary item creation failed.';
	}
};

const getItemById = async (itemId: string) => {
	try {
		const accessToken = await checkToken();
		const response = await client.get<{ item: Item; success: boolean }>(
			`item/${itemId}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
		console.log(response.data.item);
		return response.data;
	} catch (error) {
		throw error || 'Item retrieval failed.';
	}
};

export { createTemporaryItem, createBusinessItem, getItemById };
