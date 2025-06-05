// QRCodeScreen.tsx

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useLocalSearchParams, useRouter } from 'expo-router';
import HapticButton from '@/components/ui/HapticButton';
import { Ionicons } from '@expo/vector-icons';
import { useWebSocketContext } from '@/context/WebSocketContext';
import ShowToast from '@/components/ui/ShowToast';
import { useBusiness } from '@/context/BusinessContext';
import { APP_URL, ITEM_NAME } from '@/utils/constants';

const QRCodeScreen = () => {
	const router = useRouter();
	// parameter to be passed in the QR code
	const { id, from } = useLocalSearchParams();
	const transactionUrl = `${APP_URL}${ITEM_NAME}-${id}`;
	const { business } = useBusiness();
	const { lastMessage } = useWebSocketContext();

	useEffect(() => {
		if (lastMessage && lastMessage.data) {
			const messageObject = JSON.parse(lastMessage.data);
			if (messageObject.type !== 'newTransaction') return;
			const item = messageObject.data.item;
			if (item) {
				if (item._id === id) {
					router.dismissAll();
					router.replace('/business/business-home');
					ShowToast('success', 'Transaction Created');
				}
			}
		}
	}, [lastMessage]);

	const resetToHome = () => {
		router.dismissAll();
		router.replace('/business/business-home');
	};

	const onBack = async () => {
		try {
			if (from === 'ProfilePage') {
				console.log('from ProfilePage');
				if (!business) {
					ShowToast('error', 'Error', 'Business data not found.');
					return;
				}
				router.replace({
					pathname: '/business/BusinessProfileScreen',
					params: { id: business._id },
				});
				return;
			}
			router.back();
		} catch (error) {
			console.error('Error in onBack:', error);
			ShowToast('error', 'Error', 'Failed to go back. Please try again.');
		}
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
			<View className="mb-10">
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
