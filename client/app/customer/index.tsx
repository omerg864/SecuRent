'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	ScrollView,
	ActivityIndicator,
	Alert,
} from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import BusinessCard from '../../components/BusinessCard';
import { ThemedView } from '@/components/ui/ThemedView';
import type { Business } from '../../types/business';
import HapticButton from '@/components/ui/HapticButton';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { getDistance } from '@/utils/functions';

const businesses: Business[] = [
	{
		id: '1',
		name: 'Bike Shop',
		address: 'Eli visel 2 Rishon Lezion',
		category: 'Bike Rental',
		distance: 0,
		rating: 4,
		latitude: 31.9697,
		longitude: 34.7722,
	},
	{
		id: '2',
		name: 'Bowling Center',
		address: 'Eli visel 18 Rishon Lezion',
		category: 'Bowling',
		distance: 0,
		rating: 2,
		latitude: 31.9692,
		longitude: 34.773,
	},
	{
		id: '3',
		name: 'Scuba Marine',
		address: 'ahi dakar 12 Rishon Lezion',
		category: 'Scuba diving',
		distance: 0,
		rating: 5,
		latitude: 31.9635,
		longitude: 34.7701,
	},
	{
		id: '4',
		name: 'Auto Center',
		address: 'rotchild 2 Rishon Lezion',
		category: 'Car Rental',
		distance: 0,
		rating: 3,
		latitude: 31.9735,
		longitude: 34.7745,
	},
];

const CustomerHome: React.FC = () => {
	const [searchText, setSearchText] = useState<string>('');
	const [updatedBusinesses, setUpdatedBusinesses] =
		useState<Business[]>(businesses);
	const [userLocation, setUserLocation] = useState<{
		latitude: number;
		longitude: number;
	}>({
		latitude: 31.9697,
		longitude: 34.7722,
	});

	const router = useRouter();

	const onBarcodeClick = () => {
		console.log('Barcode Clicked');
		router.push('/customer/QRScanner');
	};

	const onMapClick = () => {
		console.log('Map Clicked');
		router.push('/customer/BusinessesMap');
	};

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			const { status } =
				await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert(
					'Permission Denied',
					'Location access is required to show your position.'
				);
				setLoading(false);
				return;
			}

			const location = await Location.getCurrentPositionAsync({});

			setUserLocation({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
			});

			const updatedList = businesses.map((business) => ({
				...business,
				distance: parseFloat(getDistance(
					location.coords.latitude,
					location.coords.longitude,
					business.latitude,
					business.longitude
				).toFixed(2)), // Distance in Km
			}));

			console.log(updatedList);

			setUpdatedBusinesses(updatedList);

			setLoading(false);
		})();
	}, []);

	if (loading) {
		return (
			<View className="flex-1 justify-center items-center">
				<ActivityIndicator size="large" color="#3B82F6" />
			</View>
		);
	}

	return (
		<ThemedView className="flex-1 bg-white">
			{/* Header */}
			<View className="bg-indigo-700 pt-2 pb-8">
				<View className="items-center pb-4">
					<Text className="text-white text-3xl font-bold">
						Securent
					</Text>
				</View>
			</View>

			{/* Main Content */}
			<View className="flex-1 bg-gray-100 rounded-t-3xl mt-[-16px] px-4 pt-4">
				<Text className="text-gray-600 mb-2">
					Search nearby Businesses
				</Text>

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
								<Ionicons
									name="close-circle"
									size={20}
									color="white"
								/>
							</HapticButton>
						) : null}
					</View>
					<HapticButton
						className="bg-white rounded-full w-12 h-12 items-center justify-center shadow-md"
						onPress={() => {}}
					>
						<Feather name="filter" size={20} color="#666" />
					</HapticButton>
				</View>

				{/* Tab Buttons */}
				<View className="flex-row justify-between mb-4">
					<HapticButton
						className="flex-row items-center bg-gray-200 rounded-full px-6 py-3"
						onPress={onBarcodeClick}
					>
						<MaterialIcons
							name="qr-code-scanner"
							size={20}
							color="#3B82F6"
						/>
						<Text className="text-blue-500 font-medium ml-2">
							Barcode
						</Text>
					</HapticButton>

					<HapticButton
						className="flex-row items-center bg-gray-200 rounded-full px-6 py-3"
						onPress={onMapClick}
					>
						<Feather name="map" size={20} color="#3B82F6" />
						<Text className="text-blue-500 font-medium ml-2">
							Map
						</Text>
					</HapticButton>
				</View>

				{/* Business List */}
				<ScrollView
					className="flex-1"
					showsVerticalScrollIndicator={false}
				>
					{updatedBusinesses.map((business) => (
						<BusinessCard key={business.id} business={business} />
					))}
					<View className="h-4" />
				</ScrollView>
			</View>
		</ThemedView>
	);
};

export default CustomerHome;
