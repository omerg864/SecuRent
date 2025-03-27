import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
		let response = await AsyncStorage.getItem('Business_Data');
		if (!response) {
			response = await AsyncStorage.getItem('Customer_Data');
			const res = await client.post('customer/refresh-token', {
				refreshToken,
			});
			AsyncStorage.setItem('Access_Token', res.data.accessToken);
			AsyncStorage.setItem('Refresh_Token', res.data.refreshToken);
			const expiration = new Date();
			expiration.setHours(expiration.getHours() + 23);
			AsyncStorage.setItem('Auth_Expiration', expiration.toISOString());
			return res.data.accessToken;
		} else {
			const res = await client.post('business/refresh-token', {
				refreshToken,
			});
			AsyncStorage.setItem('Access_Token', res.data.accessToken);
			AsyncStorage.setItem('Refresh_Token', res.data.refreshToken);
			const expiration = new Date();
			expiration.setHours(expiration.getHours() + 23);
			AsyncStorage.setItem('Auth_Expiration', expiration.toISOString());
			return res.data.accessToken;
		}
	} catch (error) {
		console.error('Token refresh failed:', error);
		return null;
	}
};

const checkToken = async () => {
	let token = await AsyncStorage.getItem('Access_Token');
	const storedRefreshToken = await AsyncStorage.getItem('Refresh_Token');
	const expiration = await AsyncStorage.getItem('Auth_Expiration');
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
