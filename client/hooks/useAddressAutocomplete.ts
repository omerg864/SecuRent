import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

export const useAddressAutocomplete = () => {
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<{
		address: string;
		placeId: string;
		location: { lat: number; lng: number };
	} | null>(null);

	const fetchSuggestions = async (text: string) => {
		if (text.length < 3) return;

		try {
			setLoading(true);
			const response = await fetch(
				`https://securent.onrender.com/api/location?query=${encodeURIComponent(
					text
				)}`
			);
			const data = await response.json();
			setSuggestions(data.predictions);
		} catch (error) {
			console.error('Error fetching suggestions:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchPlaceDetails = async (placeId: string) => {
		try {
			const response = await fetch(
				`https://securent.onrender.com/api/location/details?id=${placeId}`
			);
			const data = await response.json();
			return {
				address: data.address,
				location: data.location, // { lat, lng }
			};
		} catch (error) {
			console.error('Error fetching place details:', error);
			return null;
		}
	};

	const debouncedFetch = useCallback(debounce(fetchSuggestions, 400), []);

	const handleChange = (text: string) => {
		setQuery(text);
		debouncedFetch(text);
	};

	const handleSelect = async (item: any) => {
		setQuery(item.description);
		setSuggestions([]);

		const details = await fetchPlaceDetails(item.place_id);
		if (details) {
			const selectedData = {
				address: details.address,
				placeId: item.place_id,
				location: details.location,
			};
			setSelected(selectedData);
            return selectedData;
		}
        return null;
	};

	return {
		query,
		suggestions,
		loading,
		selected,
		handleChange,
		handleSelect,
	};
};
