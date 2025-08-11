import { FileObject } from '@/types/business';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
	ACCESS_TOKEN,
	ACCOUNT_SETUP,
	AUTH_EXPIRATION,
	BUSINESS_DATA,
	CURRENT_ACCOUNT_TYPE,
	CUSTOMER_DATA,
	REFRESH_TOKEN,
	TYPE,
	USER_ID,
} from './asyncStorageConstants';

export const getDistance = (
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
) => {
	const R = 6371; // Radius of Earth in Km
	const dLat = (lat2 - lat1) * (Math.PI / 180);
	const dLon = (lon2 - lon1) * (Math.PI / 180);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * (Math.PI / 180)) *
			Math.cos(lat2 * (Math.PI / 180)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c; // Distance in Km
};

export const buildFormData = (data: any, file: FileObject | null): FormData => {
	const formData = new FormData();
	for (const key in data) {
		if (data[key] !== undefined && data[key] !== null) {
			formData.append(key, JSON.stringify(data[key]) as string | Blob);
		}
	}
	if (file) {
		formData.append('image', file as any);
	}
	return formData;
};

export const NormalizedImage = (
	value: string | string[] | undefined
): string | undefined => (Array.isArray(value) ? value[0] : value);

export const formatCurrencySymbol = (code: string): string => {
	switch (code?.toUpperCase()) {
		case 'ILS':
			return '₪';
		case 'USD':
			return '$';
		case 'EUR':
			return '€';
		default:
			return code;
	}
};

export const logout = async (redirect: () => void) => {
	await AsyncStorage.removeItem(CUSTOMER_DATA);
	await AsyncStorage.removeItem(BUSINESS_DATA);
	await AsyncStorage.removeItem(ACCESS_TOKEN);
	await AsyncStorage.removeItem(REFRESH_TOKEN);
	await AsyncStorage.removeItem(ACCOUNT_SETUP);
	await AsyncStorage.removeItem(AUTH_EXPIRATION);
	await AsyncStorage.removeItem(CURRENT_ACCOUNT_TYPE);
	await AsyncStorage.removeItem(USER_ID);
	await AsyncStorage.removeItem(TYPE);

	redirect();
};
