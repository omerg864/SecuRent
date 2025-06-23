import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import HapticButton from '@/components/ui/HapticButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import Entypo from '@expo/vector-icons/Entypo';
import Header from '@/components/ui/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginUser } from '@/services/adminService';
import ShowToast from '@/components/ui/ShowToast';
import { LoginResponse } from '@/services/interfaceService';
import { ACCESS_TOKEN, ACCOUNT_SETUP, AUTH_EXPIRATION, COMPLETED_STEPS_BUSINESS, CURRENT_ACCOUNT_TYPE, REFRESH_TOKEN, USER_ID } from '@/utils/asyncStorageConstants';
import { Business } from '@/types/business';
import { Customer } from '@/types/customer';
import { useCustomer } from '@/context/CustomerContext';
import { useBusiness } from '@/context/BusinessContext';

const LoginScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { setCustomer } = useCustomer();
	const { setBusiness } = useBusiness();

	const handleLogin = async () => {
		if (!email || !password) {
			ShowToast('info', 'Please fill in all fields');
			return;
		}
		setLoading(true);
		try {
			const response: LoginResponse = await LoginUser(email, password);
			console.log(response);
			if (!response) {
				setLoading(false);
				ShowToast('error', 'Internal Server Error');

				return;
			}
			AsyncStorage.setItem(ACCESS_TOKEN, response.accessToken);
			AsyncStorage.setItem(REFRESH_TOKEN, response.refreshToken);
			const expiration = new Date();
			expiration.setHours(expiration.getHours() + 23);
			AsyncStorage.setItem(AUTH_EXPIRATION, expiration.toISOString());
			if (response.user.role === 'Customer') {
				await setCustomer(response.user as Customer);
				await AsyncStorage.multiSet([
					[CURRENT_ACCOUNT_TYPE, 'personal'],
					[USER_ID, response.user._id],
				]);
				const customerUser: Customer = response.user as Customer;

				if (!customerUser.isValid) {
					AsyncStorage.setItem(ACCOUNT_SETUP, 'true');
					AsyncStorage.setItem(CURRENT_ACCOUNT_TYPE, 'personal');
					let completedSteps = [];
					if (customerUser.isEmailValid) {
						completedSteps.push('email');
					}
					if (customerUser.isPaymentValid) {
						completedSteps.push('payment');
					}
					AsyncStorage.setItem(
						COMPLETED_STEPS_BUSINESS,
						JSON.stringify(completedSteps)
					);
					router.replace({
						pathname: './setup-screen',
						params: {
							accountType: 'personal',
						},
					});
					return;
				}
				AsyncStorage.removeItem(ACCOUNT_SETUP);
				router.replace('/customer');
			} else {
				await setBusiness(response.user as Business);
				await AsyncStorage.multiSet([
					[CURRENT_ACCOUNT_TYPE, 'business'],
					[USER_ID, response.user._id],
				]);

				const businessUser: Business = response.user as Business;

				if (!businessUser.isValid) {
					console.log('Id' + businessUser._id);
					AsyncStorage.setItem('Account_setup', 'true');
					let completedSteps = [];
					if (businessUser.isEmailValid) {
						completedSteps.push('email');
					}
					if (businessUser.isBankValid) {
						completedSteps.push('bank');
					}
					if (businessUser.isCompanyNumberVerified) {
						completedSteps.push('verification');
					}
					AsyncStorage.setItem(
						'completedSteps_business',
						JSON.stringify(completedSteps)
					);
					router.replace({
						pathname: './setup-screen',
						params: {
							accountType: 'business',
						},
					});
					return;
				}
				AsyncStorage.removeItem('Account_setup');
				router.replace('/business/business-home');
			}
		} catch (error: any) {
			ShowToast('error', error.response.data.message);
		}
		setLoading(false);
	};

	const handleRegister = () => {
		router.push('/get-started');
	};

	const handleForgotPassword = () => {
		router.push('/restore-account');
	};

	// if (loading) {
	// 	return (
	// 		<View className="flex-1 justify-center items-center">
	// 			<ActivityIndicator size="large" color={Colors.light.tint} />
	// 		</View>
	// 	);
	// }

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
			headerImage={
				<Entypo
					name="login"
					size={250}
					color="#808080"
					style={styles.headerImage}
				/>
			}
		>
			<Header title="Login" />

			<View className="flex-1 px-6">
				<ThemedText className="text-2xl font-bold mb-2">
					Welcome back
				</ThemedText>
				<ThemedText className="text-sm mb-8">
					Hey you're back, fill in your details to get back in
				</ThemedText>

				<View className="space-y-6">
					<ThemedTextInput
						className="w-full h-12 px-4 border border-gray-300 rounded-md"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
						label="Email"
					/>

					<ThemedTextInput
						className="w-full h-12 px-4 border border-gray-300 rounded-md pr-12"
						value={password}
						onChangeText={setPassword}
						secureTextEntry={!showPassword}
						label="Password"
						containerClassName="mt-4 mb-4"
						Icon={
							showPassword ? (
								<Ionicons
									name="eye-off"
									className="absolute right-0 top-3 bottom-0 justify-center px-3"
									size={24}
									color={Colors.light.tint}
								/>
							) : (
								<Ionicons
									name="eye"
									className="absolute right-0 top-3 bottom-0 justify-center px-3"
									size={24}
									color={Colors.light.tint}
								/>
							)
						}
						onIconPress={() => setShowPassword(!showPassword)}
					/>

					<TouchableOpacity
						onPress={handleForgotPassword}
						className="self-end"
					>
						<ThemedText className={`text-sm`} type="custom">
							Forgot Password?
						</ThemedText>
					</TouchableOpacity>
				</View>

				<View className="flex-row justify-between mt-auto mb-14 items-end">
					<HapticButton
						className="w-36 h-14 bg-gray-100 rounded-full justify-center items-center border border-black"
						onPress={handleRegister}
					>
						<ThemedText className="font-semibold" type="custom">
							Register
						</ThemedText>
					</HapticButton>
					<HapticButton
						style={{ backgroundColor: Colors.light.tintBlue }}
						className={`w-40 h-16 rounded-full justify-center items-center`}
						onPress={handleLogin}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator size="small" color="#FFFFFF" />
						) : (
							<ThemedText
								className="text-white font-semibold"
								lightColor="#fff"
							>
								Login
							</ThemedText>
						)}
					</HapticButton>
				</View>
			</View>
		</ParallaxScrollView>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	headerImage: {
		color: '#808080',
		bottom: -90,
		left: -35,
		position: 'absolute',
	},
});
