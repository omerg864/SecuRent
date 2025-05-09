import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { BaseModal } from '../BaseModal';

interface WarningPopupModalProps {
	visible: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	iconName?: string;
	iconColor?: string;
	iconSize?: number;
}

const WarningPopupModal = ({
	visible,
	onClose,
	onConfirm,
	title = 'Warning',
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	iconName = 'warning',
	iconColor = 'red',
	iconSize = 48,
}: WarningPopupModalProps) => {
	return (
		<BaseModal
			visible={visible}
			onClose={onClose}
			blur={true}
			centered={true}
		>
			<View className="bg-white p-6 rounded-xl w-80">
				<View className="items-center mb-4">
					<Ionicons
						name={iconName as any}
						size={iconSize}
						color={iconColor}
					/>
				</View>
				<ThemedText
					className="text-xl font-bold text-center mb-4 text-black"
					darkColor="black"
				>
					{title}
				</ThemedText>
				<ThemedText
					className="text-gray-700 text-center mb-6"
					darkColor="black"
				>
					{message}
				</ThemedText>
				<View className="flex-row justify-between">
					<TouchableOpacity
						onPress={onClose}
						className="bg-gray-200 py-3 px-6 rounded-lg"
					>
						<ThemedText
							className="font-semibold text-gray-700"
							darkColor="black"
						>
							{cancelText}
						</ThemedText>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							onConfirm();
							onClose();
						}}
						className="bg-red-500 py-3 px-6 rounded-lg"
					>
						<ThemedText
							className="font-semibold text-white"
							darkColor="white"
						>
							{confirmText}
						</ThemedText>
					</TouchableOpacity>
				</View>
			</View>
		</BaseModal>
	);
};

export default WarningPopupModal;
