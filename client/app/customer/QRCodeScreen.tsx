// QRCodeScreen.tsx

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useLocalSearchParams, useRouter } from 'expo-router';
import HapticButton from '@/components/ui/HapticButton';
import { Ionicons } from '@expo/vector-icons';
import { APP_URL, TRANSACTION_NAME } from '@/utils/constants';
import { useWebSocketContext } from '@/context/WebSocketContext';
import ShowToast from '@/components/ui/ShowToast';

const QRCodeScreen = () => {
	const router = useRouter();
	// parameter to be passed in the QR code
	const { id } = useLocalSearchParams();
	const transactionUrl = `${APP_URL}${TRANSACTION_NAME}-${id}`;

	const { lastMessage } = useWebSocketContext();

	useEffect(() => {
		if (lastMessage && lastMessage.data) {
			const messageObject = JSON.parse(lastMessage.data);
			if (messageObject.type !== 'endTransaction') return;
			const transaction = messageObject.data.transaction;
			if (transaction) {
				if (transaction._id === id) {
					router.dismissAll();
					router.replace('/customer');
				}
			}
		}
	}, [lastMessage]);

	const onBack = async () => {
		router.replace({
			pathname: '/customer/transaction-details',
			params: { id },
		});
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
				Transaction
			</Text>
			<Text className="text-base text-gray-600 mt-1">
				The business can scan this QR code to view the transaction
				details.
			</Text>

			{/* QR Code */}
			<View className="items-center justify-center flex-1 w-full">
				<View className="bg-white p-4 rounded-xl">
					<QRCode value={transactionUrl} size={240} />
				</View>
			</View>
		</View>
	);
};

export default QRCodeScreen;
