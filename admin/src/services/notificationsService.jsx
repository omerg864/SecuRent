import { checkToken, client } from './httpClient';

const getAllNotifications = async (page) => {
    try {
        const accessToken = await checkToken();
        if (!accessToken) {
            throw new Error('Access token is missing or invalid.');
        }
        const response = await client.get(`notifications/admin?page=${page}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log('Get all notifications response: ', response.data);
        return response.data;
    } catch (error) {
        console.log('Get all notifications error: ', error);
        throw new Error(
            error.response?.data?.message || 'Get all notifications failed'
        );
    }
}

export { getAllNotifications };