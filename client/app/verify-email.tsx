'use client';

import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import HapticButton from '@/components/ui/HapticButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
	verifyEmailBusiness,
	resendBusinessVerificationCode,
} from '@/services/businessService';
import {
	verifyEmailCustomer,
	resendCustomerVerificationCode,
} from '@/services/customerService';
import { ActivityIndicator } from 'react-native';
import ShowToast from '@/components/ui/ShowToast';

export default function VerifyEmailScreen() {
	const router = useRouter();
	const [code, setCode] = useState('');
	const params = useLocalSearchParams();
	const [loading, setLoading] = useState(false);
	const [loadingResend, setLoadingResend] = useState(false);
	let accountType = params.accountType as string;
	const [resendcode, setResendCode] = useState(false);

	if (!accountType) {
		accountType = params.type as string;
	}

	const handleVerify = async () => {
		if (code.trim().length === 6) {
			setLoading(true);
			try {
				const userId = await AsyncStorage.getItem('UserID');
				console.log('User ID:', userId);
				let response: any;
				if (accountType === 'business') {
					response = await verifyEmailBusiness(
						code,
						userId as string
					);
					if (!response) {
						ShowToast('error', 'Internal Server Error');
						setLoading(false);
						return;
					}
				} else {
					response = await verifyEmailCustomer(
						code,
						userId as string
					);
					if (!response) {
						ShowToast('error', 'Internal Server Error');
						setLoading(false);
						return;
					}
				}
				const type = params.type as string;
				ShowToast('success', 'Email verified successfully');

				if (!type) {
					const storageKey = `completedSteps_${accountType}`;
					const savedSteps = await AsyncStorage.getItem(storageKey);
					const completedSteps = savedSteps
						? JSON.parse(savedSteps)
						: [];
					if (!completedSteps.includes('email')) {
						completedSteps.push('email');
						await AsyncStorage.setItem(
							storageKey,
							JSON.stringify(completedSteps)
						);
					}
					await AsyncStorage.setItem(
						'current_account_type',
						accountType
					);
					router.push({
						pathname: './setup-screen',
						params: {
							accountType: accountType,
						},
					});
				} else {
					await AsyncStorage.setItem(
						'Access_Token',
						response.accessToken
					);
					await AsyncStorage.setItem(
						'Refresh_Token',
						response.refreshToken
					);
					const expiration = new Date();
					expiration.setHours(expiration.getHours() + 23);
					await AsyncStorage.setItem(
						'Auth_Expiration',
						expiration.toISOString()
					);
					await AsyncStorage.setItem('Type', JSON.stringify(type));
					router.replace('/reset-password');
				}
			} catch (error: any) {
				if (error.response?.status == 401) {
					ShowToast('error', error.response.data.message);
					setResendCode(true);
				} else {
					ShowToast('error', error.response.data.message);
				}
			} finally {
				setLoading(false);
			}
		} else {
			ShowToast('info', 'Please enter a valid 6-digit verification code');
		}
	};

	const handleResend = async () => {
		setLoadingResend(true);
		try {
			const userId = await AsyncStorage.getItem('UserID');
			if (accountType === 'business') {
				const response: any = await resendBusinessVerificationCode(
					userId as string
				);
				if (!response) {
					ShowToast('error', 'Internal Server Error');
					setLoadingResend(false);
					return;
				}
			} else {
				const response: any = await resendCustomerVerificationCode(
					userId as string
				);
				if (!response) {
					ShowToast('error', 'Internal Server Error');
					setLoadingResend(false);
					return;
				}
			}
			ShowToast('success', 'Verification code resent successfully');
		} catch (error: any) {
			if (error.response?.status == 404) {
				ShowToast('error', 'Internal Server Error');
			}
			setLoadingResend(false);
		} finally {
			setLoadingResend(false);
		}
	};

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
			onBack={() => router.back()}
			headerImage={
				<MaterialCommunityIcons
					name="email-check-outline"
					size={250}
					color="#808080"
					style={styles.headerImage}
				/>
			}
		>
			<View className="px-6 pt-8">
				<ThemedText className="text-3xl font-bold text-white">
					Verify Your Email
				</ThemedText>
				<ThemedText className="text-lg text-indigo-200 mt-1">
					Enter the verification code sent to your email
				</ThemedText>

				<View className="space-y-4 mt-8 flex-col gap-4">
					<ThemedTextInput
						className="w-full h-12 px-4 border border-gray-300 rounded-md"
						value={code}
						onChangeText={setCode}
						keyboardType="numeric"
						label="Verification Code"
					/>

					<HapticButton
						onPress={handleVerify}
						className="bg-indigo-600/30 py-3 mt-2 rounded-xl"
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator size="small" color="#FFFFFF" />
						) : (
							<ThemedText className="text-white text-center text-lg font-semibold">
								Verify Email
							</ThemedText>
						)}
					</HapticButton>

					{resendcode && (
						<HapticButton
							onPress={handleResend}
							disabled={loadingResend}
							className="bg-indigo-600/30 py-3 mt-2 rounded-xl"
						>
							{loadingResend ? (
								<ActivityIndicator
									size="small"
									color="#FFFFFF"
								/>
							) : (
								<ThemedText className="text-white text-center text-lg font-semibold">
									Resend Verification Code
								</ThemedText>
							)}
						</HapticButton>
					)}
				</View>
			</View>
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	headerImage: {
		color: '#808080',
		bottom: -90,
		left: -35,
		position: 'absolute',
	},
});
