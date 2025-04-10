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

export const buildFormData = (data: any, file: File | null): FormData => {
	const formData = new FormData();
	for (const key in data) {
		if (data[key] !== undefined && data[key] !== null) {
			formData.append(key, data[key] as string | Blob);
		}
	}
	if (file) {
		formData.append('image', file);
	}
	return formData;
};
