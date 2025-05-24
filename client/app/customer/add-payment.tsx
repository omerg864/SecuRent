import { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ui/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import { customerCardIntent, updateCreditCard } from '@/services/customerService';
import { CustomerSheet } from '@stripe/stripe-react-native';
import ShowToast from '@/components/ui/ShowToast';
import { useFocusEffect } from '@react-navigation/native';

const AddPaymentScreen = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const fetchSetupIntent = async () => {
		try {
			const response = await customerCardIntent();
			if (!response.data.success) {
				ShowToast('error', 'Internal Server Error');
				return null;
			}
			return response.data;
		} catch (error: any) {
			ShowToast('error', error?.response?.data?.message || 'Error fetching payment setup');
			return null;
		}
	};

	const handleAddCard = useCallback(async () => {
		setLoading(true);

		const data = await fetchSetupIntent();
		if (!data) {
			setLoading(false);
			return;
		}

		const { clientSecret, customer_stripe_id, ephemeralKey } = data;

		const { error: initError } = await CustomerSheet.initialize({
			setupIntentClientSecret: clientSecret,
			customerEphemeralKeySecret: ephemeralKey,
			customerId: customer_stripe_id,
			headerTextForSelectionScreen: 'Manage your payment method',
		});

		if (initError) {
			console.error('CustomerSheet initialization error:', initError);
			ShowToast('error', 'Failed to initialize payment method');
			setLoading(false);
			return;
		}

		const { error: presentError, paymentOption } = await CustomerSheet.present();

		if (presentError) {
			ShowToast('error', "Cancelled or failed to present payment method");
			setLoading(false);
			router.replace({
				pathname: './settings',
			});
			return;
		}

		try {
			const response: any = await updateCreditCard();
			if (!response.data.success) {
				ShowToast('error', 'Internal Server Error');
				setLoading(false);
				return;
			}

			ShowToast('success', 'Payment method updated successfully');
			router.replace({ pathname: './settings' });
		} catch (error: any) {
			ShowToast('error', error?.response?.data?.message || 'Failed to update payment method');
		}

		setLoading(false);
	}, [router]);

	useFocusEffect(
	useCallback(() => {
		handleAddCard();
	}, [])
);

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
			onBack={() => {
				router.replace({ pathname: './settings' });
			}}
		>
			<ScrollView className="pb-8">
				<View className="px-5 pt-8 pb-5">
					<ThemedText className="text-3xl font-bold text-white">
						Change Payment Method
					</ThemedText>
					<ThemedText className="text-lg text-indigo-200 mt-1">
						Enter your payment details
					</ThemedText>
					{loading && (
						<View className="mt-5">
							<ActivityIndicator />
						</View>
					)}
				</View>
			</ScrollView>
		</ParallaxScrollView>
	);
};

export default AddPaymentScreen;
