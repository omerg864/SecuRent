import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import {
	getLocationDetails,
	getLocationPredictions,
} from '@/services/locationService';
import { LocationPrediction } from '@/services/interfaceService';

export const useAddressAutocomplete = () => {
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState<LocationPrediction[]>([]);
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
			const data = await getLocationPredictions(text);
			setSuggestions(data);
		} catch (error) {
			console.error('Error fetching suggestions:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchPlaceDetails = async (placeId: string) => {
		try {
			const details = await getLocationDetails(placeId);
			if (details) {
				return {
					address: details.address,
					placeId: placeId,
					location: {
						lat: details.location.lat,
						lng: details.location.lng,
					},
				};
			}
			return null;
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

	const handleSelect = async (item: LocationPrediction) => {
		setQuery(item.description);
		setSuggestions([]);

		const details = await fetchPlaceDetails(item.id);
		if (details) {
			const selectedData = {
				address: details.address,
				placeId: item.id,
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
