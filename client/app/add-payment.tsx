'use client';

import { useState } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import { ThemedText } from '@/components/ui/ThemedText';
import HapticButton from '@/components/ui/HapticButton';
import { Ionicons } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateCreditCard } from '@/services/customerService';
import Toast from 'react-native-toast-message';
import { CardField, useStripe } from '@stripe/stripe-react-native';

const AddPaymentScreen = () => {
	const router = useRouter();
	const { confirmSetupIntent } = useStripe();
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const params = useLocalSearchParams();
	const accountType = (params.accountType as string) || 'personal';

	const fetchSetupIntent = async () => {
		try {
			const response: any = await updateCreditCard();
			if (!response.data.success) {
				Toast.show({
					type: 'error',
					text1: 'Internal Server Error',
				});
				return;
			}
			const { clientSecret } = response.data;
			setClientSecret(clientSecret);
			return clientSecret;
		} catch (error: any) {
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
		const secret = clientSecret || (await fetchSetupIntent());

		const { error, setupIntent } = await confirmSetupIntent(secret, {
			paymentMethodType: 'Card',
		});

		if (error) {
			Toast.show({ type: 'error', text1: error.message });
		} else if (setupIntent) {
			handleSavePayment();
		}
		setLoading(false);
	};

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

					<View className="mt-5">
						<CardField
							postalCodeEnabled={true}
							placeholders={{ number: '4242 4242 4242 4242' }}
							style={{ height: 50, marginVertical: 30 }}
						/>
					</View>

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
