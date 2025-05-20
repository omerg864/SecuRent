import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../global.css';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import {
	ACCOUNT_SETUP,
	BUSINESS_DATA,
	CUSTOMER_DATA,
} from '@/utils/asyncStorageConstants';
import { CustomerProvider } from '@/context/CustomerContext';
import { BusinessProvider } from '@/context/BusinessContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	useEffect(() => {
		if (loaded) {
			const checkStorage = async () => {
				try {
					const businessData = await AsyncStorage.getItem(
						BUSINESS_DATA
					);
					const customerData = await AsyncStorage.getItem(
						CUSTOMER_DATA
					);

					if (businessData) {
						const setup_mode = await AsyncStorage.getItem(
							ACCOUNT_SETUP
						);
						if (setup_mode === 'true') {
							router.replace('/login');
							return;
						}
						router.replace('/business/business-home');
						return;
					}

					if (customerData) {
						const setup_mode = await AsyncStorage.getItem(
							ACCOUNT_SETUP
						);
						if (setup_mode === 'true') {
							router.replace('/login');
							return;
						}

						router.replace('/customer');
						return;
					}
					router.replace('/login');
				} catch (error) {
					console.error('Error reading AsyncStorage:', error);
				} finally {
					SplashScreen.hideAsync();
				}
			};

			checkStorage();
		}
	}, [loaded]);

	const stripePublishableKey = Constants.expoConfig?.extra
		?.stripePublishableKey as string;

	if (!loaded) {
		return null;
	}

	return (
		<AuthProvider>
			<CustomerProvider>
				<BusinessProvider>
					<GestureHandlerRootView>
						<ThemeProvider
							value={
								colorScheme === 'dark'
									? DarkTheme
									: DefaultTheme
							}
						>
							<StripeProvider
								publishableKey={stripePublishableKey}
							>
								<Stack
									screenOptions={{
										headerShown: false, // Hide headers globally
									}}
								>
									<Stack.Screen name="customer" />
									<Stack.Screen name="business" />
									<Stack.Screen name="login" />
									<Stack.Screen name="get-started" />
									<Stack.Screen name="register" />
									<Stack.Screen name="+not-found" />
									<Stack.Screen name="bank-details" />
									<Stack.Screen name="setup-screen" />
									<Stack.Screen name="verification" />
									<Stack.Screen name="verify-email" />
									<Stack.Screen name="add-payment" />
									<Stack.Screen name="reset-password" />
									<Stack.Screen name="restore-account" />
								</Stack>
								<StatusBar
									style={
										colorScheme === 'dark'
											? 'dark'
											: 'light'
									}
								/>
								<Toast />
							</StripeProvider>
						</ThemeProvider>
					</GestureHandlerRootView>
				</BusinessProvider>
			</CustomerProvider>
		</AuthProvider>
	);
}
