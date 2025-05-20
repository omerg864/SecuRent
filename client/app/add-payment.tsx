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
import {
	CustomerSheet,
	CustomerSheetResult,
} from '@stripe/stripe-react-native';
import ShowToast from '@/components/ui/ShowToast';
import { COMPLETED_STEPS, CURRENT_ACCOUNT_TYPE } from '@/utils/asyncStorageConstants';

const AddPaymentScreen = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const params = useLocalSearchParams<{ accountType: string}>();
	const accountType = params.accountType || 'personal';
	const [customerSheetVisible, setCustomerSheetVisible] = useState(false);
	const [clientSecret, setClientSecret] = useState('');
	const [customerId, setCustomerId] = useState('');
	const [ephemeralKey, setEphemeralKey] = useState('');

	const fetchSetupIntent = async () => {
		try {
			const response = await customerCardIntent();
			if (!response.data.success) {
				ShowToast('error', 'Internal Server Error');

				return;
			}
			return response.data!;
		} catch (error: any) {
			ShowToast('error', error.response.data.message);
		}
	};

	const handleSavePayment = async (result: CustomerSheetResult) => {
		if (result.error) {
			ShowToast('error', result.error.code);
			router.back();
			return;
		}
		if (result.paymentMethod) {
			try {
				const response: any = await updateCreditCard();
				if (!response.data.success) {
					ShowToast('error', 'Internal Server Error');

					return;
				}

				const storageKey = `${COMPLETED_STEPS}_${accountType}`;
				const savedSteps = await AsyncStorage.getItem(storageKey);
				const completedSteps = savedSteps ? JSON.parse(savedSteps) : [];

				if (!completedSteps.includes('payment')) {
					completedSteps.push('payment');
					await AsyncStorage.setItem(
						storageKey,
						JSON.stringify(completedSteps)
					);
				}
				await AsyncStorage.setItem(CURRENT_ACCOUNT_TYPE, accountType);
				ShowToast('success', 'Payment method added successfully');

				router.replace({
					pathname: '/setup-screen',
					params: {
						accountType: accountType,
					},
				});
				setLoading(false);
			} catch (error: any) {
				ShowToast('error', error.response.data.message);
			}
		}
	};

	const handleAddCard = async () => {
		setLoading(true);
		const data = await fetchSetupIntent();
		console.log('Setup Intent Data:', data);
		if (!data) {
			ShowToast('error', 'Internal Server Error');

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
			ShowToast('error', 'Failed to initialize payment method');

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
