import { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ui/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
	customerCardIntent,
	updateCreditCard,
} from '@/services/customerService';
import Toast from 'react-native-toast-message';
import {
	CustomerSheet,
	CustomerSheetResult,
} from '@stripe/stripe-react-native';

const AddPaymentScreen = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const params = useLocalSearchParams();
	const accountType = (params.accountType as string) || 'personal';
	const [customerSheetVisible, setCustomerSheetVisible] = useState(false);
	const [clientSecret, setClientSecret] = useState('');
	const [customerId, setCustomerId] = useState('');
	const [ephemeralKey, setEphemeralKey] = useState('');

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
			Toast.show({
				type: 'error',
				text1: error.response.data.message,
			});
		}
	};

	const handleSavePayment = async (result: CustomerSheetResult) => {
		if (result.error) {
			router.back();
			Toast.show({
				type: 'error',
				text1: result.error.code,
			});
			return;
		}
		if (result.paymentMethod) {
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
        setLoading(false);
			} catch (error: any) {
				Toast.show({
					type: 'error',
					text1: error.response.data.message,
				});
			}
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

		setClientSecret(clientSecret);
		setCustomerId(customer_stripe_id);
		setEphemeralKey(ephemeralKey);

		const { error } = await CustomerSheet.initialize({
			setupIntentClientSecret: clientSecret,
			customerEphemeralKeySecret: ephemeralKey,
			customerId: customer_stripe_id,
			headerTextForSelectionScreen: 'Manage your payment method',
		});

		if (error) {
			console.error('Error initializing CustomerSheet:', error);
			Toast.show({
				type: 'error',
				text1: 'Failed to initialize payment method',
			});
			setLoading(false);
			return;
		}

		setCustomerSheetVisible(true);
	};

	useEffect(() => {
		handleAddCard();
	}, []);

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
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
						<CustomerSheet.Component
							visible={customerSheetVisible}
							setupIntentClientSecret={clientSecret}
							customerEphemeralKeySecret={ephemeralKey}
							customerId={customerId}
							headerTextForSelectionScreen={
								'Manage your payment method'
							}
							onResult={handleSavePayment}
						/>
					</View>
					{loading && <ActivityIndicator />}
				</View>
			</ScrollView>
		</ParallaxScrollView>
	);
};

export default AddPaymentScreen;
