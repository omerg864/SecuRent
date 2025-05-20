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