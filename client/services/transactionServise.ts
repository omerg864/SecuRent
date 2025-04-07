import { checkToken, client } from './httpClient';

const createTransactionFromItem = async (itemId : string) => {
    try {
        const accessToken = await checkToken();
        console.log('Access Token:', accessToken); 
        const response = await client.post<{success: boolean}>(
            `transaction/${itemId}`,
            {},
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
        );
        return response.data.success;
    } catch (error) {
        throw error || 'Transaction creation failed.';
    }
}

export { createTransactionFromItem };