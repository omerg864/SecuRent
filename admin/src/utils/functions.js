export const getShortMonthName = (monthNumber) => {
	const shortMonthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

	return shortMonthNames[monthNumber - 1] || 'Invalid month';
};

export const formatCurrencySymbol = (code) => {
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

export const formatDate = (dateStr) =>
	new Date(dateStr).toLocaleString('en-GB', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
