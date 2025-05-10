// components/ui/SubmitButton.tsx

import React from 'react';
import { View, Text } from 'react-native';
import HapticButton from './HapticButton';

type SubmitButtonProps = {
	onPress: () => void;
	disabled?: boolean;
	loading?: boolean;
	label?: string;
	className?: string;
	color?: string; // tailwind color class like "bg-green-500"
};

const SubmitButton = ({
	onPress,
	disabled = false,
	loading = false,
	label = 'Submit',
	className = '',
	color = 'bg-blue-600',
}: SubmitButtonProps) => {
	return (
		<HapticButton
			onPress={onPress}
			disabled={disabled}
			className={className}
		>
			<View
				className={`${color} py-4 rounded-full ${
					disabled ? 'opacity-50' : ''
				}`}
			>
				<Text className="text-white font-semibold text-center text-base">
					{loading ? 'Submitting...' : label}
				</Text>
			</View>
		</HapticButton>
	);
};

export default SubmitButton;
