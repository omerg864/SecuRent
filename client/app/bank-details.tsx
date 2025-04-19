import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import { ThemedText } from '@/components/ui/ThemedText';
import {
	getStripeOnboardingLink,
	verifyBankDetails,
} from '@/services/businessService';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Button, View, ActivityIndicator, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { WebView, WebViewNavigation } from 'react-native-webview';
import HapticButton from '@/components/ui/HapticButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StripeOnboardingScreen() {
	const params = useLocalSearchParams();
	const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null);
	const accountType = (params.accountType as string) || 'business';
	const [loading, setLoading] = useState(false);

	const startOnboarding = async () => {
		setLoading(true);
		try {
			const response = await getStripeOnboardingLink();
			const data = response.data;
			console.log('Onboarding URL:', data.url);
			if (!data || !data.url) {
				Toast.show({
					type: 'error',
					text1: 'Error',
					text2: 'Failed to get onboarding URL. Please try again.',
				});
				return;
			}
			setOnboardingUrl(data.url);
		} catch (err: any) {
			console.error('Error fetching onboarding URL:', err.response.data);
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: 'Failed to start onboarding. Please try again.',
			});
		}
		setLoading(false);
	};

	const handleWebViewNavigationStateChange = async (
		navState: WebViewNavigation
	) => {
		if (navState.url.includes('business/stripe-setup-success')) {
			setOnboardingUrl(null); // close the WebView
			setLoading(true);
			try {
				const response = await verifyBankDetails();

				if (!response) {
					setLoading(false);
					Toast.show({
						type: 'error',
						text1: 'Internal Server Error',
					});
					return;
				}

				const storageKey = `completedSteps_${accountType}`;
				const savedSteps = await AsyncStorage.getItem(storageKey);
				const completedSteps = savedSteps ? JSON.parse(savedSteps) : [];
				if (!completedSteps.includes('bank')) {
					completedSteps.push('bank');
					await AsyncStorage.setItem(
						storageKey,
						JSON.stringify(completedSteps)
					);
				}
				await AsyncStorage.setItem('current_account_type', accountType);
				Toast.show({
					type: 'success',
					text1: 'Bank details saved successfully',
				});
				router.replace({
					pathname: './setup-screen',
					params: {
						accountType: accountType,
					},
				});
			} catch (err: any) {
				console.error(
					'Error verifying bank details:',
					err.response.data
				);
				Toast.show({
					type: 'error',
					text1: err.response.data.message,
				});
			}
		}
	};

	if (onboardingUrl) {
		return (
			<WebView
				source={{ uri: onboardingUrl }}
				startInLoadingState={true}
				renderLoading={() => <ActivityIndicator size="large" />}
				onNavigationStateChange={handleWebViewNavigationStateChange}
			/>
		);
	}

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
			onBack={() => router.back()}
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
			<ScrollView className="pb-8">
				<View className="px-5 pt-8 pb-5">
					<ThemedText className="text-3xl font-bold text-white">
						Stripe Onboarding
					</ThemedText>
					<ThemedText className="text-lg text-indigo-200 mt-1">
						Complete your Stripe onboarding to start accepting
						payments.
					</ThemedText>

					<View className="mt-5">
						<HapticButton
							onPress={startOnboarding}
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
									Start Onboarding
								</ThemedText>
							)}
						</HapticButton>
					</View>
				</View>
			</ScrollView>
		</ParallaxScrollView>
	);
}
