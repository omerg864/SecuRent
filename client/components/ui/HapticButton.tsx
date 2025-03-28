import React from 'react';
import { StyleProp, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
	onPress: () => void;
	style?: StyleProp<any>;
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
}

const Button = ({ onPress, style, children, className = '' , disabled = false}: ButtonProps) => {
	const handlePress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		onPress();
	};

	return (
		<TouchableOpacity
			className={className}
			style={{ ...style }}
			onPress={handlePress}
			disabled={disabled}
		>
			{children}
		</TouchableOpacity>
	);
};

export default Button;
