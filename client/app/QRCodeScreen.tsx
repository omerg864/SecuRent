// QRCodeScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useLocalSearchParams, useRouter } from 'expo-router';
import HapticButton from '@/components/ui/HapticButton';
import { Ionicons } from '@expo/vector-icons';

const QRCodeScreen = () => {
	const router = useRouter();
	// parameter to be passed in the QR code
	const { id } = useLocalSearchParams();
	const transactionUrl = `secuRent://${id}`;

	const resetToHome = () => {
		router.dismissAll();
		router.replace('/business/business-home');
	};

	const onBack = () => {
		router.back();
	};

	return (
		<View className="flex-1 flex flex-col bg-[#F4F5FF] px-6 pt-14">
			{/* Back Button */}
			<HapticButton
				onPress={onBack}
				className="w-12 h-12 rounded-full bg-white justify-center items-center "
			>
				<Ionicons name="arrow-back" size={24} color="black" />
			</HapticButton>

			{/* Title & Description */}
			<Text className="text-2xl mt-6 font-bold text-[#09090B]">
				New Transaction
			</Text>
			<Text className="text-base text-gray-600 mt-1">
				Create a new transaction for a customer
			</Text>

			{/* QR Code */}
			<View className="items-center justify-center flex-1 w-full">
				<View className="bg-white p-4 rounded-xl">
					<QRCode value={transactionUrl} size={240} />
				</View>
			</View>

			{/* Continue Button */}
			<View className='mb-10'>
				<TouchableOpacity
					className="bg-[#3B28CC] py-4 rounded-xl items-center"
					onPress={resetToHome}
				>
					<Text className="text-white text-base font-semibold">
						Done
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default QRCodeScreen;
