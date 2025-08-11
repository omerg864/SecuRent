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

type FileLike = File | Blob | FileObject;

export const buildFormData = (
	data: Record<string, any>,
	file?: FileLike | null,
	fileFieldName = 'image',
	fileName?: string
): FormData => {
	const fd = new FormData();

	const append = (key: string, value: any) => {
		if (value === undefined || value === null) return;

		// File/Blob
		if (value instanceof Blob || value instanceof File) {
			const name = (value as File).name ?? fileName ?? 'upload.bin';
			fd.append(key, value, name);
			return;
		}

		// Primitive -> string
		if (typeof value !== 'object') {
			fd.append(key, String(value));
			return;
		}

		// Arrays/objects -> JSON (or flatten if your backend expects bracketed keys)
		fd.append(key, JSON.stringify(value));
	};

	// Properly iterate real keys
	for (const [key, value] of Object.entries(data ?? {})) {
		append(key, value);
	}

	if (file) append(fileFieldName, file);

	return fd;
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
