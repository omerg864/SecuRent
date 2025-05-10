import { checkToken, client } from './httpClient';

const getTransactionById = async (id) => {
    try {
        const accessToken = await checkToken();
        if (!accessToken) {
            throw new Error('Access token is missing or invalid.');
        }
        const response = await client.get(`transaction/admin/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log('Get transaction by ID response: ', response.data.transaction);
        return response.data.transaction;
    } catch (error) {
        console.log('Get transaction by ID error: ', error);
        throw new Error(
            error.response?.data?.message || 'Get transaction by ID failed'
        );
    }
}

export { getTransactionById };