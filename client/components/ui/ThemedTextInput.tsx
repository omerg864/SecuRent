import {
	TextInput,
	TextInputProps,
	TouchableOpacity,
	View,
} from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { ThemedText } from './ThemedText';

export type ThemedTextProps = TextInputProps & {
	lightColor?: string;
	darkColor?: string;
	onChangeText: (text: string) => void;
	value: string;
	Icon?: React.ReactNode;
	label?: string;
	onIconPress?: () => void;
	containerClassName?: string;
	labelClassName?: string;
};

export function ThemedTextInput({
	lightColor,
	darkColor,
	onChangeText,
	value,
	Icon,
	label,
	onIconPress,
	containerClassName = '',
	labelClassName = '',
	...rest
}: ThemedTextProps) {
	const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

	return (
		<View className={`space-y-2 ${containerClassName}`}>
			{label && (
				<ThemedText className={`text-sm font-medium ${labelClassName}`}>
					{label}
				</ThemedText>
			)}
			<View className="relative">
				<TextInput
					onChangeText={onChangeText}
					value={value}
					style={[{ color }]}
					{...rest}
				/>
				{Icon && (
					<TouchableOpacity
						onPress={onIconPress}
						className="absolute right-0 top-0 bottom-0 justify-center px-3"
					>
						{Icon}
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}
