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
	Modal,
	Button,
} from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import BusinessCard from '../../components/BusinessCard';
import { ThemedView } from '@/components/ui/ThemedView';
import type { Business } from '../../types/business';
import HapticButton from '@/components/ui/HapticButton';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { getDistance } from '@/utils/functions';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const businesses_obj: Business[] = [
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
	const [businesses, setBusinesses] = useState<Business[]>(businesses_obj);

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
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [categories, setCategories] = useState([
		{ label: 'All', value: 'All' },
		{ label: 'Bike Rental', value: 'Bike Rental' },
		{ label: 'Bowling', value: 'Bowling' },
		{ label: 'Scuba Diving', value: 'Scuba diving' },
		{ label: 'Car Rental', value: 'Car Rental' },
	]);

	// Modal State
	const [modalVisible, setModalVisible] = useState(false);
	const [maxDistance, setMaxDistance] = useState(10);
	const [minRating, setMinRating] = useState(0);


	const onBarcodeClick = () => {
		router.push('/customer/QRScanner');
	};

	const onMapClick = () => {
		router.push('/customer/BusinessesMap');
	};

	const onSearch = (text: string) => {
		setSearchText(text);
		if (!text) {
			applyFilters();
			return;
		}
		const filteredBusinesses = updatedBusinesses.filter((business) =>
			business.name.toLowerCase().includes(text.toLowerCase())
		);
		setUpdatedBusinesses(filteredBusinesses);
	};

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
				distance: parseFloat(
					getDistance(
						location.coords.latitude,
						location.coords.longitude,
						business.latitude,
						business.longitude
					).toFixed(2)
				), // Distance in Km
			}));
			setBusinesses(updatedList);
			setUpdatedBusinesses(updatedList);
			setLoading(false);
		})();
	}, []);

	// Function to apply filters
	const applyFilters = () => {
		if (!searchText) {
			const filteredBusinesses = businesses.filter(
				(business) =>
					business.distance <= maxDistance &&
					(selectedCategory === 'All' ||
						business.category === selectedCategory) &&
					business.rating >= minRating
			);
			setUpdatedBusinesses(filteredBusinesses);
			return;
		}
		const filteredBusinesses = updatedBusinesses.filter(
			(business) =>
				business.distance <= maxDistance &&
				(selectedCategory === 'All' ||
					business.category === selectedCategory) &&
				business.rating >= minRating
		);
		setUpdatedBusinesses(filteredBusinesses);
		setModalVisible(false);
	};

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
							onChangeText={onSearch}
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
						onPress={() => setModalVisible(true)}
					>
						<Feather name="filter" size={20} color="#666" />
					</HapticButton>
				</View>

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

			{/* Filter Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View
					className="flex-1 justify-center items-center"
					style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
				>
					<View className="bg-white w-4/5 p-6 rounded-lg">
						<Text className="text-lg font-semibold mb-4">
							Filter Options
						</Text>

						{/* Max Distance Slider */}
						<Text className="text-gray-700">
							Max Distance: {maxDistance} km
						</Text>
						<Slider
							minimumValue={1}
							maximumValue={50}
							step={1}
							value={maxDistance}
							onValueChange={setMaxDistance}
						/>

						{/* Category Picker */}
						<Text className="text-gray-700 mt-4">Category</Text>
						<Picker
							selectedValue={selectedCategory}
							onValueChange={(itemValue) =>
								setSelectedCategory(itemValue)
							}
							mode="dropdown" // Ensures dropdown mode for Android
							style={{
								width: '100%',
								color: 'black',
							}}
						>
							{categories.map((category) => (
								<Picker.Item
									key={category.value}
									color="black"
									label={category.label}
									value={category.value}
								/>
							))}
						</Picker>
						{/* Rating Slider */}
						<Text className="text-gray-700 mt-4">
							Minimum Rating: {minRating} Stars
						</Text>
						<Slider
							minimumValue={0}
							maximumValue={5}
							step={1}
							value={minRating}
							onValueChange={setMinRating}
						/>

						{/* Buttons */}
						<View className="flex-row justify-between mt-6">
							<Button
								title="Cancel"
								color="red"
								onPress={() => setModalVisible(false)}
							/>
							<Button
								title="Apply"
								color="blue"
								onPress={applyFilters}
							/>
						</View>
					</View>
				</View>
			</Modal>
		</ThemedView>
	);
};

export default CustomerHome;
