import { checkToken, client } from './httpClient';
import { ItemId } from './interfaceService';

const createItem = async (
	description: string,
	date: Date,
	price: number,
	temporary: boolean
) => {
	try {
		const accessToken = await checkToken();
		const response = await client.post<ItemId>(
			'item',
			{
				temporary,
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

export { createItem };
