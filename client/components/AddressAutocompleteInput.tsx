import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useAddressAutocomplete } from '../hooks/useAddressAutocomplete';
import { LocationPrediction } from '@/services/interfaceService';
import { ThemedTextInput } from './ui/ThemedTextInput';
import { ThemedText } from './ui/ThemedText';
import ShowToast from './ui/ShowToast';

export default function AddressAutocompleteInput({
	onSelect,
	labelClassName = '',
	label = 'Address',
}: {
	onSelect: (
		address: string,
		placeId: string,
		location: { lat: number; lng: number }
	) => void;
	labelClassName?: string;
	label?: string;
}) {
	const { query, suggestions, handleChange, handleSelect } =
		useAddressAutocomplete();

	const onItemPress = async (item: LocationPrediction) => {
		console.log('Selected item:', item);
		const selected = await handleSelect(item);
		if (selected) {
			onSelect(
				selected?.address || '',
				selected?.placeId || '',
				selected?.location || { lat: 0, lng: 0 }
			);
		} else {
			ShowToast('error', ' Location not found');
		}
	};

	return (
		<View className="z-10 relative">
			<ThemedText className={`text-sm font-medium ${labelClassName}`}>
				{label}
			</ThemedText>
			<ThemedTextInput
				value={query}
				onChangeText={handleChange}
				className="w-full h-12 px-4 border border-gray-300 rounded-md"
			/>

			{suggestions.length > 0 && (
				<View className="absolute top-20 left-0 w-full rounded-lg mt-1 bg-black text-white">
					{suggestions.map((item) => (
						<TouchableOpacity
							key={item.id}
							className="p-3 border-b border-gray-500"
							onPress={() => onItemPress(item)}
						>
							<Text className="text-white">
								{item.description}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			)}
		</View>
	);
}
