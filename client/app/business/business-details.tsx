'use client';

import { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import { ThemedText } from '@/components/ui/ThemedText';
import HapticButton from '@/components/ui/HapticButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
	updateBusinessAccount,
	updateBusinessDetails,
} from '@/services/businessService';
import AddressAutocompleteInput from '../../components/ui/AddressAutoCompleteInput';
import { BusinessResponse, StepResponse } from '@/services/interfaceService';
import { TouchableOpacity } from '@/components/ui/touchable-opacity';
import ModalList from '@/components/ModalList';
import { businessTypes, currencies, Currency } from '@/utils/constants';
import MultiSelectInput from '@/components/ui/MultiSelectInput';
import { emailRegex, phone_regex } from '@/utils/regex';
import ShowToast from '@/components/ui/ShowToast';
import { useBusiness } from '@/context/BusinessContext';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { FileObject } from '@/types/business';
import ProfileImageInput from '@/components/ProfileImageInput';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';

export default function UpdateBusinessDetails() {
	const router = useRouter();
	const { updateBusiness, business } = useBusiness();
	const [businessNumber, setBusinessNumber] = useState(
		business?.companyNumber || ''
	);
	const [name, setName] = useState(business?.name || '');
	const [email, setEmail] = useState(business?.email || '');
	const [file, setFile] = useState<FileObject | null>(null);
	const [phoneNumber, setPhoneNumber] = useState(business?.phone || '');
	const [loading, setLoading] = useState(false);
	const [currency, setCurrency] = useState(business?.currency || 'ILS');
	const [modalVisible, setModalVisible] = useState(false);
	const [categories, setCategories] = useState<string[]>(
		business?.category || []
	);

	const [selectedLocation, setSelectedLocation] = useState<{
		address: string;
		lat: number;
		lng: number;
	} | null>({
		address: business?.address || '',
		lat: business?.location?.coordinates[1] || 0,
		lng: business?.location?.coordinates[0] || 0,
	});

	const handleVerify = async () => {
		if (!businessNumber || !phoneNumber || !selectedLocation || !currency) {
			ShowToast('info', 'Please fill in all fields');
			return;
		}
		if (!selectedLocation.address) {
			ShowToast('info', 'Please select a valid address');
			return;
		}
		if (!phone_regex.test(phoneNumber.trim())) {
			ShowToast('info', 'Please enter a valid phone number');
			return;
		}
		if (!name.trim()) {
			ShowToast('info', 'Please enter a valid business name');
			return;
		}
		if (!email.trim() || !emailRegex.test(email.trim())) {
			ShowToast('info', 'Please enter a valid email address');
			return;
		}
		if (!/^\d{9}$/.test(businessNumber.trim())) {
			ShowToast('info', 'Please enter a valid 9-digit business number');
			return;
		}
		setLoading(true);
		try {
			console.log('Updating business details with:', {
				companyNumber: businessNumber.trim(),
				phone: phoneNumber.trim(),
				address: selectedLocation?.address,
				location: {
					type: 'Point',
					coordinates: [
						selectedLocation?.lng || 0, // lng first for GeoJSON
						selectedLocation?.lat || 0, // lat second for GeoJSON
					],
				},
				currency: currency,
				category: categories,
			});
			const response = await updateBusinessAccount(
				{
					companyNumber: businessNumber.trim(),
					phone: phoneNumber.trim(),
					address: selectedLocation?.address,
					location: {
						type: 'Point',
						coordinates: [
							selectedLocation?.lat || 0,
							selectedLocation?.lng || 0,
						],
					},
					currency: currency,
					category: categories,
					name: name.trim(),
					email: email.trim(),
				},
				file
			);
			updateBusiness({
				companyNumber: businessNumber.trim(),
				phone: phoneNumber.trim(),
				address: selectedLocation?.address,
				location: {
					type: 'Point',
					coordinates: [
						selectedLocation?.lat || 0,
						selectedLocation?.lng || 0,
					],
				},
				currency: currency,
				category: categories,
				name: name.trim(),
				email: email.trim(),
				image: response.business?.image || business?.image,
			});

			if (!response.success) {
				setLoading(false);
				ShowToast('error', 'Internal Server Error');
				return;
			}

			ShowToast('success', 'Business verified successfully');
			router.replace({
				pathname: '/business/settings',
			});
		} catch (error: any) {
			ShowToast('error', error.response.data.message);
		} finally {
			setLoading(false);
		}
	};

	const renderCurrencyItem = (item: Currency) => (
		<TouchableOpacity
			style={{
				padding: 15,
				borderBottomWidth: 1,
				borderBottomColor: '#D0D0D0',
			}}
			onPress={() => {
				setCurrency(item.code);
				setModalVisible(false);
			}}
		>
			<ThemedText style={{ fontSize: 16, color: '#333' }}>
				{item.name} ({item.code})
			</ThemedText>
		</TouchableOpacity>
	);

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#D0D0D0', dark: '#D0D0D0' }}
			onBack={() => router.replace('/business/settings')}
			headerImage={
				<MaterialCommunityIcons
					name="check-outline"
					size={250}
					color="#808080"
					style={styles.headerImage}
				/>
			}
		>
			<ScrollView className="pb-8 bg-white">
				<View className="px-5 pt-8 pb-5">
					<Text className="text-3xl mb-4 font-bold text-black">
						Update Business Details
					</Text>

					<ProfileImageInput
						file={file}
						label="Business Image"
						setFile={setFile}
						initialUrl={business?.image}
						labelColor="black"
					/>

					<Text className="text-lg font-semibold mb-2">
						Business Name
					</Text>
					<TextInput
						className="w-full h-12 px-4 border border-gray-300 rounded-md"
						value={name}
						onChangeText={setName}
						autoCapitalize="words"
					/>

					<Text className="text-lg font-semibold mb-2">Email</Text>
					<TextInput
						className="w-full h-12 px-4 border border-gray-300 rounded-md"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
					/>

					<Text className="text-lg font-semibold mb-2">
						Phone Number
					</Text>
					<TextInput
						keyboardType="phone-pad"
						value={phoneNumber}
						onChangeText={setPhoneNumber}
						className="w-full h-12 px-4 border border-gray-300 rounded-md"
						editable={!loading}
					/>

					<AddressAutocompleteInput
						label="Business Address"
						defaultAddress={business?.address}
						onSelect={(
							address: string,
							placeId: any,
							location: { lat: number; lng: number }
						) => {
							setSelectedLocation({
								address,
								lat: location.lat,
								lng: location.lng,
							});
						}}
					/>

					<Text className="text-lg font-semibold mb-2">
						Business Number
					</Text>
					<TextInput
						keyboardType="numeric"
						value={businessNumber}
						onChangeText={setBusinessNumber}
						className="w-full h-12 px-4 border border-gray-300 rounded-md"
						editable={!loading}
					/>

					<View className="mb-4">
						<Text className="text-black font-semibold text-lg">
							Currency
						</Text>
						<TouchableOpacity
							className="h-12 w-full border border-gray-300 rounded-xl justify-center items-center"
							onPress={() => setModalVisible(true)}
							disabled={loading}
						>
							<Text className="text-lg text-black">
								{currency || 'Select Currency'}
							</Text>
						</TouchableOpacity>
					</View>

					<MultiSelectInput
						label="Business Categories"
						labelColor="black"
						nameSingle="Category"
						namePlural="Categories"
						selected={categories}
						setSelected={setCategories}
						options={businessTypes}
					/>

					<HapticButton
						onPress={handleVerify}
						className="bg-indigo-600 py-3 mt-2 rounded-xl"
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator size="small" color="#FFFFFF" />
						) : (
							<Text className="text-white text-center text-lg font-semibold">
								Update Business Details
							</Text>
						)}
					</HapticButton>
					<ModalList<Currency>
						data={currencies}
						renderFunction={renderCurrencyItem}
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						uniqueKey="code"
					/>
				</View>
			</ScrollView>
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	headerImage: {
		color: '#808080',
		bottom: -90,
		left: -35,
		position: 'absolute',
	},
});
