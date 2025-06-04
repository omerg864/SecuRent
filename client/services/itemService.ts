import { FileObject } from '@/types/business';
import { checkToken, client } from './httpClient';
import { buildFormData } from '@/utils/functions';
import { Item } from '@/types/item';
import {
	AuthResponse,
	ItemResponse,
	SuccessResponse,
} from './interfaceService';

const createTemporaryItem = async (
	description: string,
	date: Date,
	price: number
) => {
	try {
		const accessToken = await checkToken();
		const response = await client.post<ItemResponse>(
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
	smartPrice: boolean = false,
	file: FileObject | null = null
) => {
	try {
		const accessToken = await checkToken();
		const formData = buildFormData(
			{
				smartPrice,
				description,
				price,
				duration,
				timeUnit,
			},
			file
		);
		const response = await client.post<ItemResponse>('item', formData, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'multipart/form-data',
			},
		});
		return response.data;
	} catch (error) {
		throw error || 'Temporary item creation failed.';
	}
};

const getItemById = async (itemId: string) => {
	try {
		const accessToken = await checkToken();
		const response = await client.get<ItemResponse>(`item/${itemId}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		return response.data;
	} catch (error) {
		throw error || 'Item retrieval failed.';
	}
};

const getItemByIdForTransaction = async (itemId: string) => {
	try {
		const accessToken = await checkToken();
		const response = await client.get<ItemResponse>(`item/${itemId}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		const item = response.data.item;

		if (!item.temporary && item.duration && item.timeUnit) {
			const now = Date.now();
			if (item.timeUnit === 'days') {
				item.return_date = new Date(
					now + item.duration * 24 * 60 * 60 * 1000
				).toISOString();
			} else if (item.timeUnit === 'hours') {
				item.return_date = new Date(
					now + item.duration * 60 * 60 * 1000
				).toISOString();
			} else if (item.timeUnit === 'minutes') {
				item.return_date = new Date(
					now + item.duration * 60 * 1000
				).toISOString();
			}
		}

		return {
			success: response.data.success,
			item,
		};
	} catch (error) {
		throw error || 'Item retrieval failed.';
	}
};

const deleteItem = async (itemId: string) => {
	try {
		const accessToken = await checkToken();
		const response = await client.delete<SuccessResponse>(
			`item/${itemId}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
		console.log(response.data);
		return response.data;
	} catch (error) {
		throw error || 'Item deletion failed.';
	}
};

const getItemByIdForBusiness = async (itemId: string) => {
	const accessToken = await checkToken();
	const response = await client.get<ItemResponse>(`item/business/${itemId}`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	return response.data;
};

const updateItemById = async (
	id: string,
	formData: FormData
) => {
	try {
		const accessToken = await checkToken();
		const response = await client.put<ItemResponse>(
			`item/${id}`,
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
		throw error || 'Item update failed.';
	}
};

const deleteItemById = async (id: string) => {
	try {
		const accessToken = await checkToken();
		const response = await client.delete<AuthResponse>(`item/${id}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error || 'Item deletion failed.';
	}
};

export {
	createTemporaryItem,
	createBusinessItem,
	getItemById,
	updateItemById,
	getItemByIdForBusiness,
	deleteItemById,
	getItemByIdForTransaction,
	deleteItem,
};
