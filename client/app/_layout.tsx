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

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	useEffect(() => {
		if (loaded) {
			AsyncStorage.getItem('user').then((user) => {
				if (user) {
					const parsedUser = JSON.parse(user);
					if (parsedUser.role === 'customer') {
						router.replace('/customer');
					} else {
						router.replace('/business');
					}
				} else {
					//router.replace('/customer');
					router.replace('/login');
				}
			});
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<AuthProvider>
			<ThemeProvider
				value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
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
					<Stack.Screen name="buisness-setup" />
					<Stack.Screen name="verification" />
					<Stack.Screen name="verify-email" />
				</Stack>
				<StatusBar style={colorScheme === 'dark' ? 'dark' : 'light'} />
			</ThemeProvider>
		</AuthProvider>
	);
}
