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
