import React, { useState } from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import HapticButton from '@/components/ui/HapticButton';
import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { identifyUser } from '@/services/adminService';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { emailRegex } from '@/utils/regex';
import ShowToast from '@/components/ui/ShowToast';
import { USER_ID } from '@/utils/asyncStorageConstants';

const RestoreAccountScreen = () => {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);

	const handleRestore = async () => {
		if (!email) {
			ShowToast('info', 'Please enter your email address');
			return;
		}
		if (!emailRegex.test(email)) {
			ShowToast('info', 'Email address is invalid');
			return;
		}
		setLoading(true);
		try {
			const response: any = await identifyUser(email);
			if (!response.success) {
				ShowToast('error', 'Internal Server Error');
				setLoading(false);
				return;
			}
			await AsyncStorage.setItem(USER_ID, response.userId);
			router.push({
				pathname: './verify-email',
				params: {
					type: response.type,
					userId: response.userId,
				},
			});
		} catch (error: any) {
			ShowToast('error', error.response.data.message);
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
			onBack={() => router.back()}
			headerImage={
				<MaterialCommunityIcons
					name="email-outline"
					size={250}
					color="#808080"
					style={styles.headerImage}
				/>
			}
		>
			<View className="px-6 pt-8">
				<ThemedText className="text-3xl font-bold text-white">
					Restore Your Account
				</ThemedText>
				<ThemedText className="text-lg text-indigo-200 mt-1">
					Enter your email
				</ThemedText>

				<View className="space-y-4 mt-8 flex-col gap-4">
					<ThemedTextInput
						className="w-full h-12 px-4 border border-gray-300 rounded-md"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
						label="Email"
					/>

					<HapticButton
						onPress={handleRestore}
						className="bg-indigo-600/30 py-3 mt-2 rounded-xl"
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator size="small" color="#FFFFFF" />
						) : (
							<ThemedText className="text-white text-center text-lg font-semibold">
								Restore Account
							</ThemedText>
						)}
					</HapticButton>
				</View>
			</View>
		</ParallaxScrollView>
	);
};

export default RestoreAccountScreen;

const styles = StyleSheet.create({
	headerImage: {
		color: '#808080',
		bottom: -90,
		left: -35,
		position: 'absolute',
	},
});
