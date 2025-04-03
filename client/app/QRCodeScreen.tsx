// QRCodeScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useLocalSearchParams, useRouter } from 'expo-router';
import HapticButton from '@/components/ui/HapticButton';

const QRCodeScreen = () => {
	const router = useRouter();
	// parameter to be passed in the QR code
	const { transactionId } = useLocalSearchParams();
	const transactionUrl = `secuRent://${transactionId}`;

	const resetToHome = () => {
		router.dismissAll();
		router.replace('/business/business-home');
	};

	return (
		<View className="flex-1 justify-center items-center bg-white px-6">
			<Text className="text-2xl font-bold text-center mb-2">
				Scan to Open Transaction
			</Text>
			<Text className="text-base text-center text-gray-600">
				Use your camera to scan the QR code below and view your
				transaction.
			</Text>

			<View className="my-10">
				<QRCode value={transactionUrl} size={200} />
			</View>

			<HapticButton
				className="bg-blue-600 px-6 py-3 rounded-xl"
				onPress={resetToHome}
			>
				<Text className="text-white text-base font-medium">
					Go Home
				</Text>
			</HapticButton>
		</View>
	);
};

export default QRCodeScreen;
