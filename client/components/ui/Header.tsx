import React from 'react';
import { View } from 'react-native';
import HapticButton from '@/components/ui/HapticButton';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';

interface HeaderProps {
	title: string;
}

const Header = ({ title }: HeaderProps) => {
	return (
		<View className="w-full p-6 flex-row justify-between items-baseline gap-4 text-center">
			<ThemedText
				type="title"
				className="text-xl font-bold text-center flex-1"
			>
				{title}
			</ThemedText>
		</View>
	);
};

export default Header;
