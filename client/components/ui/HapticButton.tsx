import React from 'react';
import { StyleProp, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
	onPress: () => void;
	style: StyleProp<any>;
	children: React.ReactNode;
}

const Button = ({ onPress, style, children }: ButtonProps) => {
	const handlePress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		onPress();
	};

	return (
		<TouchableOpacity style={{ ...style }} onPress={handlePress}>
			{children}
		</TouchableOpacity>
	);
};

export default Button;
