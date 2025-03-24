import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import HapticButton from '@/components/ui/HapticButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import Entypo from '@expo/vector-icons/Entypo';
import Header from '@/components/ui/Header';
import { loginBusiness } from '@/services/businessService';
import { loginCustomer } from '@/services/customerService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BusinessLoginResponse, CustomerLoginResponse } from '@/services/interfaceService';

const LoginScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	const handleLogin = async () => {
		if (!email || !password) {
			alert('Please fill in all fields');
			return;
		}
		try {
			const response : BusinessLoginResponse = await loginBusiness({ email, password });
			if (!response) {
				return;
			}
			AsyncStorage.setItem("Access_Token", response.accessToken);
			AsyncStorage.setItem("Refresh_Token", response.refreshToken);
			AsyncStorage.setItem("Business_Data", JSON.stringify(response.business));
			const expiration = new Date();
			expiration.setHours(expiration.getHours() + 23);
			AsyncStorage.setItem("Auth_Expiration", expiration.toISOString());
			router.replace('/business/business-home');
		}
		catch (error) {	
			console.log(error);
		}
		try {
			const response : CustomerLoginResponse = await loginCustomer({ email, password });
			if (!response) {
				return;
			}
			AsyncStorage.setItem("Access_Token", response.accessToken);
			AsyncStorage.setItem("Refresh_Token", response.refreshToken);
			AsyncStorage.setItem("Customer_Data", JSON.stringify(response.customer));
			const expiration = new Date();
			expiration.setHours(expiration.getHours() + 23);
			AsyncStorage.setItem("Auth_Expiration", expiration.toISOString());
			router.replace('/customer');
		}
		catch (error) {
			console.log(error);
		}

	};

	const handleRegister = () => {
		router.push('/get-started');
	};

	const handleForgotPassword = () => {
		console.log('Forgot Password');
	};

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

				<View className="flex-row justify-between mt-auto mb-14 items-baseline">
					<HapticButton
						className="w-24 h-12 bg-gray-100 rounded-full justify-center items-center"
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
					>
						<ThemedText
							className="text-white font-semibold"
							lightColor="#fff"
						>
							Login
						</ThemedText>
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
