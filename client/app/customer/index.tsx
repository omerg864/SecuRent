'use client';

import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	ScrollView,
	ActivityIndicator,
	Modal,
	Button,
} from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import BusinessCard from '../../components/BusinessCard';
import { ThemedView } from '@/components/ui/ThemedView';
import HapticButton from '@/components/ui/HapticButton';
import { useFocusEffect, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { getNearestBusinesses } from '@/services/businessService';
import { Business } from '@/services/interfaceService';
import debounce from 'lodash/debounce';
import ShowToast from '@/components/ui/ShowToast';

const CustomerHome: React.FC = () => {
	const [searchText, setSearchText] = useState<string>('');
	const [businesses, setBusinesses] = useState<Business[]>([]);
	const [userLocation, setUserLocation] = useState<{
		latitude: number;
		longitude: number;
	}>({
		latitude: 31.9697,
		longitude: 34.7722,
	});

	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [categories, setCategories] = useState([
		{ label: 'All', value: 'all' },
		{ label: 'Bike Rental', value: 'Bike Rental' },
		{ label: 'Bowling', value: 'Bowling' },
		{ label: 'Scuba Diving', value: 'Scuba diving' },
		{ label: 'Car Rental', value: 'Car Rental' },
	]);

	const searchInputRef = useRef<TextInput>(null);

	// Modal State
	const [modalVisible, setModalVisible] = useState(false);
	const [maxDistance, setMaxDistance] = useState(50);
	const [minRating, setMinRating] = useState(0);

	const onBarcodeClick = () => {
		router.push('/customer/QRScanner');
	};

	const onMapClick = () => {
		router.push({
			pathname: '/customer/BusinessesMap',
			params: {
				businesses: JSON.stringify(businesses),
			},
		});
	};

	const debouncedSearch = useMemo(
		() =>
			debounce((text: string) => {
				setSearchText(text);
			}, 500), // 500 ms debounce
		[]
	);

	const onSearch = (text: string) => {
		debouncedSearch(text);
	};

	// Make sure to cancel debounce when unmounting
	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	const applyFilters = () => {
		setModalVisible(false);
		refetchBusinesses();
	};

	const refetchBusinesses = () => {
		setLoading(true);
		fetchBusinesses();
	};

	const fetchBusinesses = async () => {
		const { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') {
			ShowToast(
				'error',
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
		try {
			const businessResponse = await getNearestBusinesses(
				location.coords.latitude,
				location.coords.longitude,
				maxDistance,
				minRating,
				selectedCategory,
				searchText
			);
			// console.log('Business Response:', businessResponse);
			setBusinesses(businessResponse);
		} catch (error) {
			console.log('error fetching businesses: ', error);
		} finally {
			setLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			refetchBusinesses();

			// Optional cleanup if you want to reset state
			return () => {
				setBusinesses([]);
				setSearchText('');
			};
		}, [])
	);

	useEffect(() => {
		refetchBusinesses();
	}, [searchText]);

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
							onChangeText={onSearch}
							ref={searchInputRef}
						/>
						{searchText ? (
							<HapticButton
								onPress={() => {
									searchInputRef.current?.blur();
									searchInputRef.current?.clear();
									setSearchText('');
								}}
							>
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
				{loading ? (
					<View className="text-center items-center">
						<ActivityIndicator size="large" color="#000" />
						<Text className="mt-4 text-gray-600">
							Loading businesses...
						</Text>
					</View>
				) : businesses.length > 0 ? (
					<ScrollView
						className="flex-1"
						showsVerticalScrollIndicator={false}
					>
						{businesses.map((business) => (
							<BusinessCard
								key={business._id}
								business={business}
								onPress={() =>
									router.push({
										pathname:
											'./customer/BusinessProfileScreen',
										params: { id: business._id },
									})
								}
							/>
						))}
						<View className="h-4" />
					</ScrollView>
				) : (
					<View className="text-center items-center">
						<Text className="text-gray-600 text-lg">
							No nearby businesses found.
						</Text>
					</View>
				)}
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
							minimumValue={10}
							maximumValue={500}
							step={1}
							value={maxDistance}
							onValueChange={setMaxDistance}
						/>

						{/* Category Picker */}
						<Text className="text-gray-700 mt-4">Category</Text>
						<Picker
							selectedValue={selectedCategory}
							onValueChange={(itemValue) => {
								console.log('Selected :', itemValue);
								setSelectedCategory(itemValue);
							}}
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
