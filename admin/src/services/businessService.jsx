import { checkToken, client } from './httpClient';

const getBusinessById = async (id) => {
    try {
        const accessToken = await checkToken();
        if (!accessToken) {
            throw new Error('Access token is missing or invalid.');
        }
        const response = await client.get(`business/business-profile/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log('Get business by ID response: ', response.data.business);
        return response.data.business;
    } catch (error) {
        console.log('Get business by ID error: ', error);
        throw new Error(
            error.response?.data?.message || 'Get business by ID failed'
        );
    }
}

export { getBusinessById };