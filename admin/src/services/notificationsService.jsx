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

const markAdminNotificationAsRead = async (id) => {
    try {
        const accessToken = await checkToken();
        if (!accessToken) {
            throw new Error('Access token is missing or invalid.');
        }
        const response = await client.put(
            'notifications/admin/read',
            { id },
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );
        return response.data;
    } catch (error) {
        console.log('Mark admin notification as read error: ', error);
        throw new Error(
            error.response?.data?.message || 'Mark admin notification as read failed'
        );
    }
}

export { getAllNotifications, markAdminNotificationAsRead };