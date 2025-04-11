import React from 'react';
import {
	View,
	TextInput,
	FlatList,
	TouchableOpacity,
	Text,
	StyleSheet,
} from 'react-native';
import { useAddressAutocomplete } from '../hooks/useAddressAutocomplete';
import Toast from 'react-native-toast-message';
import { LocationPrediction } from '@/services/interfaceService';
import { ThemedTextInput } from './ui/ThemedTextInput';
import { ThemedText } from './ui/ThemedText';

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
			Toast.show({
				type: 'error',
				text1: 'Location not found',
			});
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
