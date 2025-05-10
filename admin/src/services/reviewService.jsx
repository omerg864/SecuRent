import { checkToken, client } from './httpClient';

const getReviewById = async (id) => {
    try {
        const accessToken = await checkToken();
        if (!accessToken) {
            throw new Error('Access token is missing or invalid.');
        }
        const response = await client.get(`review/${id}`);
        console.log('Get review by ID response: ', response.data.review);
        return response.data.review;
    } catch (error) {
        console.log('Get review by ID error: ', error);
        throw new Error(
            error.response?.data?.message || 'Get review by ID failed'
        );
    }
}

export { getReviewById };