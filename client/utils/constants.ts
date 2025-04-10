export interface Currency {
	name: string;
	symbol: string;
	code: string;
}

export const currencies: Currency[] = [
	{
		name: 'Israeli New Shekel',
		symbol: '₪',
		code: 'ILS',
	},
	{
		name: 'United States Dollar',
		symbol: '$',
		code: 'USD',
	},
	{
		name: 'Euro',
		symbol: '€',
		code: 'EUR',
	},
	{
		name: 'British Pound Sterling',
		symbol: '£',
		code: 'GBP',
	},
	{
		name: 'Japanese Yen',
		symbol: '¥',
		code: 'JPY',
	},
	{
		name: 'Australian Dollar',
		symbol: '$',
		code: 'AUD',
	},
	{
		name: 'Canadian Dollar',
		symbol: '$',
		code: 'CAD',
	},
];

export interface Bank {
	label: string;
	value: string;
}

export const banks: Bank[] = [
	{ label: 'Bank Hapoalim', value: 'bank_hapoalim' },
	{ label: 'Leumi Bank', value: 'leumi_bank' },
	{ label: 'Mizrahi Tefahot Bank', value: 'mizrahi_tefahot' },
	{ label: 'Discount Bank', value: 'discount_bank' },
	{
		label: 'First International Bank of Israel',
		value: 'first_international_bank',
	},
	{
		label: 'Bank of Jerusalem and the Middle East',
		value: 'bank_jerusalem',
	},
	{ label: 'Bank Otzar HaHayal', value: 'bank_otzar_hahyal' },
	{ label: 'Union Bank', value: 'union_bank' },
	{ label: 'Bank Yahav', value: 'bank_yahav' },
	{ label: 'Bank Massad', value: 'bank_massad' },
];

export const MAX_SELECTION_DEFAULT = 8;
export const MAX_SELECTION_LENGTH_DEFAULT = 20;

export const businessTypes = [
	'Car Rental',
	'Bike Rental',
	'Camera Rental',
	'Tool Rental',
	'Party Equipment',
	'Vacation Homes',
	'Boat Rental',
	'Costume Rental',
];
