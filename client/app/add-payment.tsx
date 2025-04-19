'use client';

import { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import { ThemedText } from '@/components/ui/ThemedText';
import HapticButton from '@/components/ui/HapticButton';
import { Ionicons } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
	customerCardIntent,
	updateCreditCard,
} from '@/services/customerService';
import Toast from 'react-native-toast-message';
import { useStripe } from '@stripe/stripe-react-native';

const AddPaymentScreen = () => {
	const router = useRouter();
	const { initCustomerSheet, presentCustomerSheet } = useStripe();
	const [loading, setLoading] = useState(false);
	const params = useLocalSearchParams();
	const accountType = (params.accountType as string) || 'personal';

	const fetchSetupIntent = async () => {
		try {
			const response = await customerCardIntent();
			if (!response.data.success) {
				Toast.show({
					type: 'error',
					text1: 'Internal Server Error',
				});
				return;
			}
			return response.data!;
		} catch (error: any) {
      console.error('Error fetching setup intent:', error.response.data);
			Toast.show({
				type: 'error',
				text1: error.response.data.message,
			});
		}
	};

	const handleSavePayment = async () => {
		try {
			const response: any = await updateCreditCard();
			if (!response.data.success) {
				Toast.show({
					type: 'error',
					text1: 'Internal Server Error',
				});
				return;
			}

			const storageKey = `completedSteps_${accountType}`;
			const savedSteps = await AsyncStorage.getItem(storageKey);
			const completedSteps = savedSteps ? JSON.parse(savedSteps) : [];

			if (!completedSteps.includes('payment')) {
				completedSteps.push('payment');
				await AsyncStorage.setItem(
					storageKey,
					JSON.stringify(completedSteps)
				);
			}
			await AsyncStorage.setItem('current_account_type', accountType);
			Toast.show({
				type: 'success',
				text1: 'Payment method added successfully',
			});
			router.replace({
				pathname: '/setup-screen',
				params: {
					accountType: accountType,
				},
			});
		} catch (error: any) {
			Toast.show({
				type: 'error',
				text1: error.response.data.message,
			});
		}
	};

	const handleAddCard = async () => {
		setLoading(true);
		const data = await fetchSetupIntent();
    console.log('Setup Intent Data:', data);
		if (!data) {
      Toast.show({
        type: 'error',
        text1: 'Internal Server Error',
      });
			setLoading(false);
			return;
		}
		const { clientSecret, customer_stripe_id, ephemeralKey } = data;

		const { error: initError } = await initCustomerSheet({
			merchantDisplayName: 'Expo, Inc.',

			customerId: customer_stripe_id,
			customerEphemeralKeySecret: ephemeralKey,
			setupIntentClientSecret: clientSecret,
		});

		if (initError) {
			console.error('Init error:', initError);
			setLoading(false);
			return;
		}

		const { error: sheetError } = await presentCustomerSheet();

		if (sheetError) {
			console.error('Sheet error:', sheetError);
		} else {
			console.log('Customer added a new payment method!');
		}
		setLoading(false);
	};

	useEffect(() => {
		handleAddCard();
	}, []);

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
			onBack={() => router.back()}
			headerImage={
				<Ionicons
					name="card-outline"
					size={250}
					color="#808080"
					style={{ position: 'absolute', bottom: -90, left: -35 }}
				/>
			}
		>
			<ScrollView className="pb-8">
				<View className="px-5 pt-8 pb-5">
					<ThemedText className="text-3xl font-bold text-white">
						Add Payment Method
					</ThemedText>
					<ThemedText className="text-lg text-indigo-200 mt-1">
						Enter your payment details
					</ThemedText>

					<View className="mt-5"></View>

					{/* Save Button */}
					<View className="flex-row justify-center mt-4">
						<HapticButton
							onPress={handleAddCard}
							className="bg-indigo-600/30 py-3 px-8 rounded-xl w-full"
							disabled={loading}
						>
							{loading ? (
								<ActivityIndicator
									size="small"
									color="#FFFFFF"
								/>
							) : (
								<ThemedText className="text-white text-center text-lg font-semibold">
									Save Payment Method
								</ThemedText>
							)}
						</HapticButton>
					</View>
				</View>
			</ScrollView>
		</ParallaxScrollView>
	);
};

export default AddPaymentScreen;
