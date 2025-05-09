import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';

interface LoadingSpinnerProps {
	label?: string;
	size?: 'small' | 'large';
}
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	label,
	size = 'large',
}) => {
	return (
		<View className="flex-1 justify-center items-center bg-white">
			<ActivityIndicator size={size} color="#000" />
			{label && <Text className="mt-4 text-gray-600">{label}</Text>}
		</View>
	);
};

export default LoadingSpinner;
