import { checkToken, client } from './httpClient';
import { Item } from './interfaceService';

const createItem = async (
	description: string,
	date: Date,
	price: number,
	temporary: boolean,
	duration: string
) => {
	try {
		const accessToken = await checkToken();
		const response = await client.post<{item: Item, success: boolean}>(
			'item',
			{
				temporary,
				description,
				date,
				price,
				duration,
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

const getItemById = async (itemId: string) => {
	try {
		const accessToken = await checkToken();
		const response = await client.get<{item: Item, success: boolean}>(
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

export { createItem , getItemById };
