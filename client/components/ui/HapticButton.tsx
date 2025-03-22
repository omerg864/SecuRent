import React from 'react';
import { StyleProp, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
	onPress: () => void;
	style?: StyleProp<any>;
	children: React.ReactNode;
	className?: string;
}

const Button = ({ onPress, style, children, className = '' }: ButtonProps) => {
	const handlePress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		onPress();
	};

	return (
		<TouchableOpacity
			className={className}
			style={{ ...style }}
			onPress={handlePress}
		>
			{children}
		</TouchableOpacity>
	);
};

export default Button;
