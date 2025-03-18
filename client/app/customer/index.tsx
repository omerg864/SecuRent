'use client';

import type React from 'react';
import { useState } from 'react';
import {
	View,
	Text,
	SafeAreaView,
	TextInput,
	ScrollView,
} from 'react-native';
import {
	Feather,
	Ionicons,
	MaterialIcons,
} from '@expo/vector-icons';
import BusinessCard from '../../components/BusinessCard';
import { ThemedView } from '@/components/ui/ThemedView';
import type { Business } from '../../types/business';
import HapticButton from '@/components/ui/HapticButton';


const businesses: Business[] = [
	{
		id: "1",
		name: 'Bike Shop',
		address: 'Eli visel 2 Rishon Lezion',
		category: 'Bike Rental',
		distance: '10Km Away',
		rating: 4,
	},
	{
		id: "2",
		name: 'Bowling Center',
		address: 'Eli visel 18 Rishon Lezion',
		category: 'Bowling',
		distance: '12Km Away',
		rating: 2,
	},
	{
		id: "3",
		name: 'Scuba Marine',
		address: 'ahi dakar 12 Rishon Lezion',
		category: 'Scuba diving',
		distance: '14Km Away',
		rating: 5,
	},
	{
		id: "4",
		name: 'Auto Center',
		address: 'rotchild 2 Rishon Lezion',
		category: 'Car Rental',
		distance: '20Km Away',
		rating: 3,
	},
];

const CustomerHome: React.FC = () => {
	const [searchText, setSearchText] = useState<string>('');

	return (
		<ThemedView className="flex-1 bg-white">
			{/* Header */}
			<View className="bg-indigo-700 pt-2 pb-8">
				<View className="items-center pb-4">
					<Text className="text-white text-3xl font-bold">Securent</Text>
				</View>
			</View>

			{/* Main Content */}
			<View className="flex-1 bg-gray-100 rounded-t-3xl mt-[-16px] px-4 pt-4">
				<Text className="text-gray-600 mb-2">Search nearby Businesses</Text>

				{/* Search Bar */}
				<View className="flex-row mb-4">
					<View className="flex-row items-center bg-indigo-700 rounded-full flex-1 px-4 py-2 mr-2">
						<Ionicons name="search" size={20} color="white" />
						<TextInput
							className="flex-1 text-white ml-2 mr-1"
							placeholder="Search..."
							placeholderTextColor="#CCCCCC"
							value={searchText}
							onChangeText={setSearchText}
						/>
						{searchText ? (
							<HapticButton onPress={() => setSearchText('')}>
								<Ionicons name="close-circle" size={20} color="white" />
							</HapticButton>
						) : null}
					</View>
					<HapticButton className="bg-white rounded-full w-12 h-12 items-center justify-center shadow-md" onPress={() => {}}>
						<Feather name="filter" size={20} color="#666" />
					</HapticButton>
				</View>

				{/* Tab Buttons */}
				<View className="flex-row justify-between mb-4">
					<HapticButton className="flex-row items-center bg-gray-200 rounded-full px-6 py-3" onPress={() => {}}>
						<MaterialIcons name="qr-code-scanner" size={20} color="#3B82F6" />
						<Text className="text-blue-500 font-medium ml-2">Barcode</Text>
					</HapticButton>

					<HapticButton className="flex-row items-center bg-gray-200 rounded-full px-6 py-3" onPress={() => {}}>
						<Feather name="map" size={20} color="#3B82F6" />
						<Text className="text-blue-500 font-medium ml-2">Map</Text>
					</HapticButton>
				</View>

				{/* Business List */}
				<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
					{businesses.map((business) => (
						<BusinessCard key={business.id} business={business} />
					))}
					<View className="h-4" />
				</ScrollView>
			</View>
		</ThemedView>
	);
};

export default CustomerHome;