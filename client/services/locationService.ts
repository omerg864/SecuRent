import { client } from './httpClient';
import { LocationDetails, LocationPrediction } from './interfaceService';

export const getLocationPredictions = async (
	query: string
): Promise<LocationPrediction[]> => {
	try {
		const response = await client.get<{ success: boolean, predictions: LocationPrediction[]}>('/location', {
			params: { query },
		});
		return response.data.predictions;
	} catch (error) {
		console.error('Error fetching location predictions:', error);
		throw error;
	}
};

export const getLocationDetails = async (
	placeId: string
): Promise<LocationDetails> => {
	try {
		const response = await client.get<{ success: boolean } & LocationDetails>('/location/details', {
			params: { id: placeId },
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching location details:', error);
		throw error;
	}
};
