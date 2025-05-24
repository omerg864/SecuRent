import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import { ThemedText } from '@/components/ui/ThemedText';
import { getStripeOnboardingLink } from '@/services/businessService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { WebView, WebViewNavigation } from 'react-native-webview';
import HapticButton from '@/components/ui/HapticButton';
import ShowToast from '@/components/ui/ShowToast';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UpdateBankDetails() {
	const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const startOnboarding = async () => {
		setLoading(true);
		try {
			const response = await getStripeOnboardingLink();
			const data = response.data;
			console.log('Onboarding URL:', data.url);
			if (!data || !data.url) {
				ShowToast(
					'error',
					'Error',
					'Failed to get onboarding URL. Please try again.'
				);

				return;
			}
			setOnboardingUrl(data.url);
		} catch (err: any) {
			console.error('Error fetching onboarding URL:', err.response.data);
			ShowToast(
				'error',
				'Error',
				'Failed to start onboarding. Please try again.'
			);
		}
		setLoading(false);
	};

	const handleWebViewNavigationStateChange = async (
		navState: WebViewNavigation
	) => {
		if (navState.url.includes('business/stripe-setup-success')) {
			setOnboardingUrl(null);
			setLoading(false);
			ShowToast(
				'success',
				'Success',
				'Bank details updated successfully.'
			);
			router.replace('/business/settings');
		}
	};

	if (onboardingUrl) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
				<WebView
					source={{ uri: onboardingUrl }}
					startInLoadingState={true}
					style={{ marginTop: 20 }}
					renderLoading={() => <ActivityIndicator size="large" />}
					onNavigationStateChange={handleWebViewNavigationStateChange}
				/>
			</SafeAreaView>
		);
	}

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#D0D0D0', dark: '#D0D0D0' }}
			onBack={() => router.replace('/business/settings')}
			headerImage={
				<Ionicons
					name="cash-outline"
					size={250}
					color="#808080"
					style={{
						color: '#808080',
						position: 'absolute',
						bottom: -90,
						left: -35,
					}}
				/>
			}
		>
			<ScrollView className="pb-8 bg-white">
				<View className="px-5 pt-8 pb-5">
					<Text className="text-3xl font-bold text-black">
						Stripe Bank Details
					</Text>
					<Text className="text-lg text-black mt-1">
						Change your bank details through Stripe.
					</Text>

					<View className="mt-6">
						<HapticButton
							onPress={startOnboarding}
							className="bg-indigo-600 py-3 px-8 rounded-xl w-full"
							disabled={loading}
						>
							{loading ? (
								<ActivityIndicator
									size="small"
									color="#FFFFFF"
								/>
							) : (
								<ThemedText className="text-white text-center text-lg font-semibold">
									Change Bank Details
								</ThemedText>
							)}
						</HapticButton>
					</View>
				</View>
			</ScrollView>
		</ParallaxScrollView>
	);
}
