import { checkToken, client } from './httpClient';

const getAllReports = async (page, status) => {
    try {
        const accessToken = await checkToken();
        if (!accessToken) {
            throw new Error('Access token is missing or invalid.');
        }
        const response = await client.get(`report?page=${page}&status=${status}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        console.log('Get all reports error: ', error);
        throw new Error(
            error.response?.data?.message || 'Get all reports failed'
        );
    }
};

const getReportById = async (id) => {
    try {
        const accessToken = await checkToken();
        if (!accessToken) {
            throw new Error('Access token is missing or invalid.');
        }
        const response = await client.get(`report/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log('Get report by ID response: ', response.data);
        return response.data.report;
    } catch (error) {
        console.log('Get report by ID error: ', error);
        throw new Error(
            error.response?.data?.message || 'Get report by ID failed'
        );
    }
};

const resolveReport = async (status, resolution, id) => {
    try {
        const accessToken = await checkToken();
        if (!accessToken) {
            throw new Error('Access token is missing or invalid.');
        }
        const response = await client.put(
            `report/${id}`,
            { status, resolution },
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );
        return response.data;
    } catch (error) {
        console.log('Resolve report error: ', error);
        throw new Error(
            error.response?.data?.message || 'Resolve report failed'
        );
    }
}

export { getAllReports, getReportById , resolveReport};