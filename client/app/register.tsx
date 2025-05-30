import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import HapticButton from '@/components/ui/HapticButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Header from '@/components/ui/Header';
import { useLocalSearchParams } from 'expo-router';
import { registerBusiness } from '@/services/businessService';
import { registerCustomer } from '@/services/customerService';
import { LoginUser } from '@/services/adminService';
import { AuthData } from '@/services/interfaceService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import ProfileImageInput from '@/components/ProfileImageInput';
import { emailRegex, passwordRegex } from '@/utils/regex';
import { Business, FileObject } from '@/types/business';
import ShowToast from '@/components/ui/ShowToast';
import {
	ACCESS_TOKEN,
	ACCOUNT_SETUP,
	AUTH_EXPIRATION,
	CURRENT_ACCOUNT_TYPE,
	CUSTOMER_DATA,
	REFRESH_TOKEN,
	USER_ID,
} from '@/utils/asyncStorageConstants';
import { useCustomer } from '@/context/CustomerContext';
import { Customer } from '@/types/customer';
import { useBusiness } from '@/context/BusinessContext';

const RegisterScreen = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { accountType } = useLocalSearchParams();
	const [file, setFile] = useState<FileObject | null>(null);
	const { setCustomer } = useCustomer();
	const { setBusiness } = useBusiness();

	const goBack = () => {
		router.back();
	};

	const handleRegister = async () => {
		if (!name || !email || !password || !confirmPassword) {
			ShowToast('info', 'Please fill in all fields');
			return;
		}
		if (password !== confirmPassword) {
			ShowToast('info', 'Passwords do not match');
			return;
		}
		if (!emailRegex.test(email)) {
			ShowToast('info', 'Email address is invalid');
			return;
		}
		//Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.
		if (!passwordRegex.test(password)) {
			ShowToast(
				'info',
				'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.'
			);
			return;
		}
		setLoading(true);
		try {
			const Data: AuthData = {
				name,
				email,
				password,
			};
			if (accountType === 'business') {
				const response = await registerBusiness(Data, file);
				if (!response) {
					setLoading(false);
					return;
				}
				console.log('Business registration response:', response);
				const loginResponse = await LoginUser(email, password);
				if (!loginResponse.success) {
					setLoading(false);
					return;
				}
				console.log('Business login response:', loginResponse);
				AsyncStorage.setItem(USER_ID, loginResponse.user._id);
				AsyncStorage.setItem(ACCESS_TOKEN, loginResponse.accessToken);
				AsyncStorage.setItem(REFRESH_TOKEN, loginResponse.refreshToken);
				AsyncStorage.setItem(CURRENT_ACCOUNT_TYPE, 'business');
				setBusiness(loginResponse.user as Business);
			} else {
				const response = await registerCustomer(Data, file);
				if (!response) {
					setLoading(false);
					return;
				}
				console.log('Customer registration response:', response);
				const loginResponse = await LoginUser(email, password);
				if (!loginResponse.success) {
					setLoading(false);
					return;
				}
				console.log('Customer login response:', loginResponse);
				AsyncStorage.setItem(USER_ID, loginResponse.user._id);
				AsyncStorage.setItem(ACCESS_TOKEN, loginResponse.accessToken);
				AsyncStorage.setItem(REFRESH_TOKEN, loginResponse.refreshToken);
				AsyncStorage.setItem(CURRENT_ACCOUNT_TYPE, 'personal');
				setCustomer(loginResponse.user as Customer);
			}
			const expiration = new Date();
			expiration.setHours(expiration.getHours() + 23);
			AsyncStorage.setItem(AUTH_EXPIRATION, expiration.toISOString());
			AsyncStorage.setItem(ACCOUNT_SETUP, 'true');
			ShowToast('success', 'Account created successfully');
			router.dismissAll();
			router.replace({
				pathname: './setup-screen',
				params: { accountType },
			});
		} catch (error: any) {
			console.error('Error registering:', error.response.data.message);
			ShowToast('error', error.response.data.message);
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
			onBack={goBack}
			headerImage={
				<FontAwesome5
					name="user-plus"
					size={250}
					color="#808080"
					style={styles.headerImage}
				/>
			}
		>
			<Header title="Register" />

			<View className="flex-1 px-6">
				<ThemedText className="text-2xl font-bold mb-2">
					Welcome, create your {accountType} Account
				</ThemedText>
				<ThemedText className="text-sm">
					Hey there! Let's get you started
				</ThemedText>

				<View className="space-y-6">
					<ProfileImageInput
						file={file}
						label={`${
							accountType === 'business' ? 'Business ' : ''
						}Image`}
						setFile={setFile}
					/>

					<ThemedTextInput
						className="w-full h-12 px-4 border border-gray-300 rounded-md"
						value={name}
						onChangeText={setName}
						autoCapitalize="words"
						label={
							accountType === 'business'
								? 'Business name'
								: 'Name'
						}
					/>

					<ThemedTextInput
						className="w-full h-12 px-4 border border-gray-300 rounded-md"
						value={email}
						onChangeText={setEmail}
						containerClassName="mt-4"
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
						containerClassName="mt-4"
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

					<ThemedTextInput
						className="w-full h-12 px-4 border border-gray-300 rounded-md pr-12"
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						secureTextEntry={!showConfirmPassword}
						label="Confirm Password"
						containerClassName="mt-4 mb-4"
						Icon={
							showConfirmPassword ? (
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
						onIconPress={() =>
							setShowConfirmPassword(!showConfirmPassword)
						}
					/>
				</View>

				<View className="flex-row justify-center mt-auto mb-20 items-end">
					<HapticButton
						style={{ backgroundColor: Colors.light.tintBlue }}
						className="w-40 h-16 rounded-full justify-center items-center"
						onPress={handleRegister}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator size="small" color="#FFFFFF" />
						) : (
							<ThemedText
								className="text-white font-semibold"
								lightColor="#fff"
							>
								Sign up
							</ThemedText>
						)}
					</HapticButton>
				</View>
			</View>
		</ParallaxScrollView>
	);
};

export default RegisterScreen;

const styles = StyleSheet.create({
	headerImage: {
		color: '#808080',
		bottom: -90,
		left: -35,
		position: 'absolute',
	},
});
