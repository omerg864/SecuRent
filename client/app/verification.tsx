'use client';

import { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import HapticButton from '@/components/ui/HapticButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateBusinessDetails } from '@/services/businessService';
import AddressAutocompleteInput from '@/components/AddressAutocompleteInput';
import { StepResponse } from '@/services/interfaceService';
import { TouchableOpacity } from '@/components/ui/touchable-opacity';
import ModalList from '@/components/ModalList';
import { businessTypes, currencies, Currency } from '@/utils/constants';
import MultiSelectInput from '@/components/ui/MultiSelectInput';
import { phone_regex } from '@/utils/regex';
import ShowToast from '@/components/ui/ShowToast';
import {
	COMPLETED_STEPS,
	CURRENT_ACCOUNT_TYPE,
} from '@/utils/asyncStorageConstants';
import { useBusiness } from '@/context/BusinessContext';

export default function VerifyBusinessNumberScreen() {
	const router = useRouter();
	const [businessNumber, setBusinessNumber] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [loading, setLoading] = useState(false);
	const [currency, setCurrency] = useState('ILS');
	const [modalVisible, setModalVisible] = useState(false);
	const [categories, setCategories] = useState<string[]>([]);
	const { updateBusiness } = useBusiness();

	const [selectedLocation, setSelectedLocation] = useState<{
		address: string;
		lat: number;
		lng: number;
	} | null>(null);
	const params = useLocalSearchParams();
	const accountType = (params.accountType as string) || 'business';

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
		if (!/^\d{9}$/.test(businessNumber.trim())) {
			ShowToast('info', 'Please enter a valid 9-digit business number');
			return;
		}
		setLoading(true);
		try {
			const response: StepResponse = await updateBusinessDetails({
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
			});
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
			});

			if (!response.success) {
				setLoading(false);
				ShowToast('error', 'Internal Server Error');
				return;
			}

			const storageKey = `${COMPLETED_STEPS}_${accountType}`;
			const savedSteps = await AsyncStorage.getItem(storageKey);
			const completedSteps = savedSteps ? JSON.parse(savedSteps) : [];

			if (!completedSteps.includes('verification')) {
				completedSteps.push('verification');
				await AsyncStorage.setItem(
					storageKey,
					JSON.stringify(completedSteps)
				);
			}

			await AsyncStorage.setItem(CURRENT_ACCOUNT_TYPE, accountType);
			ShowToast('success', 'Business verified successfully');
			router.replace({
				pathname: './setup-screen',
				params: {
					accountType: accountType,
				},
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
			headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
			onBack={() => router.back()}
			headerImage={
				<MaterialCommunityIcons
					name="check-outline"
					size={250}
					color="#808080"
					style={styles.headerImage}
				/>
			}
		>
			<View className="px-6 pt-8 flex flex-col gap-2">
				<ThemedText className="text-3xl font-bold text-white">
					Enter Business Details
				</ThemedText>
				<ThemedText className="text-lg text-indigo-200 mt-1">
					Enter your business details to verify your account
				</ThemedText>

				<ThemedTextInput
					keyboardType="phone-pad"
					value={phoneNumber}
					onChangeText={setPhoneNumber}
					className="w-full h-12 px-4 border border-gray-300 rounded-md"
					label="Phone Number"
					editable={!loading}
				/>

				<AddressAutocompleteInput
					label="Business Address"
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

				<ThemedTextInput
					keyboardType="numeric"
					value={businessNumber}
					onChangeText={setBusinessNumber}
					className="w-full h-12 px-4 border border-gray-300 rounded-md"
					label="Business Number"
					editable={!loading}
				/>

				<View className="mb-4">
					<ThemedText className="text-white text-lg">
						Currency
					</ThemedText>
					<TouchableOpacity
						className="h-12 w-full border border-gray-300 rounded-xl justify-center items-center"
						onPress={() => setModalVisible(true)}
						disabled={loading}
					>
						<ThemedText className="text-lg text-gray-900">
							{currency || 'Select Currency'}
						</ThemedText>
					</TouchableOpacity>
				</View>

				<MultiSelectInput
					label="Business Categories"
					nameSingle="Category"
					namePlural="Categories"
					selected={categories}
					setSelected={setCategories}
					options={businessTypes}
				/>

				<HapticButton
					onPress={handleVerify}
					className="bg-indigo-600/30 py-3 mt-2 rounded-xl"
					disabled={loading}
				>
					{loading ? (
						<ActivityIndicator size="small" color="#FFFFFF" />
					) : (
						<ThemedText className="text-white text-center text-lg font-semibold">
							Update Business Details
						</ThemedText>
					)}
				</HapticButton>
			</View>
			<ModalList<Currency>
				data={currencies}
				renderFunction={renderCurrencyItem}
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				uniqueKey="code"
			/>
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
