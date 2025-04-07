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

export default function AddressAutocompleteInput({
	onSelect,
}: {
	onSelect: (
		address: string,
		placeId: string,
		location: { lat: number; lng: number }
	) => void;
}) {
	const { query, suggestions, handleChange, handleSelect } =
		useAddressAutocomplete();

	const onItemPress = async (item: any) => {
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
		<View style={{ zIndex: 10 }}>
			<TextInput
				value={query}
				onChangeText={handleChange}
				placeholder="Enter business address"
				style={styles.input}
			/>

			{suggestions.length > 0 && (
				<FlatList
					data={suggestions}
					keyExtractor={(item) => item.place_id}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={styles.item}
							onPress={() => onItemPress(item)}
						>
							<Text>{item.description}</Text>
						</TouchableOpacity>
					)}
					style={styles.dropdown}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 12,
		borderRadius: 8,
		backgroundColor: 'white',
	},
	dropdown: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		marginTop: 4,
		maxHeight: 200,
	},
	item: {
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
});
