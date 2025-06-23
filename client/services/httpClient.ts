import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN, AUTH_EXPIRATION, BUSINESS_DATA, CUSTOMER_DATA, REFRESH_TOKEN } from '@/utils/asyncStorageConstants';

const URL = Constants.expoConfig?.extra?.apiUrl as string;
console.log('API URL:', URL);

const client = axios.create({
	baseURL: URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

const refreshToken = async (refreshToken: string) => {
	try {
		let response = await AsyncStorage.getItem(BUSINESS_DATA);
		if (!response) {
			response = await AsyncStorage.getItem(CUSTOMER_DATA);
			const res = await client.post('customer/refresh-token', {
				refreshToken,
			});
			AsyncStorage.setItem(ACCESS_TOKEN, res.data.accessToken);
			AsyncStorage.setItem(REFRESH_TOKEN, res.data.refreshToken);
			const expiration = new Date();
			expiration.setHours(expiration.getHours() + 23);
			AsyncStorage.setItem(AUTH_EXPIRATION, expiration.toISOString());
			return res.data.accessToken;
		} else {
			const res = await client.post('business/refresh-token', {
				refreshToken,
			});
			AsyncStorage.setItem(ACCESS_TOKEN, res.data.accessToken);
			AsyncStorage.setItem(REFRESH_TOKEN, res.data.refreshToken);
			const expiration = new Date();
			expiration.setHours(expiration.getHours() + 23);
			AsyncStorage.setItem(AUTH_EXPIRATION, expiration.toISOString());
			return res.data.accessToken;
		}
	} catch (error) {
		console.error('Token refresh failed:', error);
		return null;
	}
};

const checkToken = async () => {
	let token = await AsyncStorage.getItem(ACCESS_TOKEN);
	const storedRefreshToken = await AsyncStorage.getItem(REFRESH_TOKEN);
	const expiration = await AsyncStorage.getItem(AUTH_EXPIRATION);
	if (!token) {
		if (!storedRefreshToken) {
			throw new Error('User is not authenticated');
		}
		console.log('Refreshing token...');
		token = await refreshToken(storedRefreshToken);
	}

	if (expiration && new Date(expiration) < new Date()) {
		if (!storedRefreshToken) {
			throw new Error('No refresh token');
		}
		console.log('Token expired. Refreshing token...');
		token = await refreshToken(storedRefreshToken);
	}
	if (!token) {
		throw new Error('Token refresh failed');
	}
	return token;
};

export { client, checkToken, refreshToken };
