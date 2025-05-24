import React, { useState, useRef } from 'react';
import {
	View,
	Text,
	Pressable,
	Animated,
	LayoutAnimation,
	UIManager,
	Platform,
	NativeSyntheticEvent,
	TextInputKeyPressEventData,
	TextStyle,
	StyleProp,
} from 'react-native';
import { ThemedTextInput } from './ThemedTextInput';
import { ThemedText } from './ThemedText';
import { MAX_SELECTION_DEFAULT } from '@/utils/constants';

if (
	Platform.OS === 'android' &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MultiSelectInputProps {
	label?: string;
	options: string[];
	nameSingle?: string;
	namePlural?: string;
	selected: string[];
	setSelected: (selected: string[]) => void;
	max_selection?: number;
	max_selection_length?: number;
	labelColor?: string;
}

export default function MultiSelectInput({
	label,
	options,
	nameSingle,
	namePlural,
	selected,
	setSelected,
	max_selection,
	max_selection_length,
	labelColor = '',
}: MultiSelectInputProps) {
	const labelStyle: StyleProp<TextStyle> = {};
	if (labelColor) {
		labelStyle.color = labelColor;
	}
	const [input, setInput] = useState('');
	const [filtered, setFiltered] = useState<string[]>(options);
	const [error, setError] = useState('');
	const [containerHeight, setContainerHeight] = useState(0);

	const MAX_SELECTION = max_selection || MAX_SELECTION_DEFAULT;
	const MAX_LENGTH = max_selection_length || 20;

	const animatedHeight = useRef(new Animated.Value(0)).current;

	const onLayout = (event: any) => {
		const newHeight = event.nativeEvent.layout.height;
		if (newHeight !== containerHeight) {
			Animated.timing(animatedHeight, {
				toValue: newHeight,
				duration: 200,
				useNativeDriver: false,
			}).start();
			setContainerHeight(newHeight);
		}
	};

	const handleSelect = (item: string) => {
		const trimmed = item.trim();

		if (selected.length >= MAX_SELECTION) {
			setError(`You can only add up to ${MAX_SELECTION} ${namePlural}`);
			return;
		}

		if (trimmed.length === 0) return;

		if (trimmed.length > MAX_LENGTH) {
			setError(`${nameSingle} must be ${MAX_LENGTH} characters or less`);
			return;
		}

		if (!selected.includes(trimmed)) {
			LayoutAnimation.configureNext(
				LayoutAnimation.Presets.easeInEaseOut
			);
			setSelected([...selected, trimmed]);
		}

		setInput('');
		setError('');
	};

	const removeTag = (item: string) => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setSelected(selected.filter((i) => i !== item));
		setError('');
	};

	const handleInputChange = (text: string) => {
		if (text.length > MAX_LENGTH) {
			setError(`${nameSingle} must be ${MAX_LENGTH} characters or less`);
			return;
		} else {
			setError('');
		}

		setInput(text);
		const matching = options.filter(
			(item) =>
				item.toLowerCase().includes(text.toLowerCase()) &&
				!selected.includes(item)
		);
		setFiltered(matching);
	};

	const handleSubmit = () => {
		handleSelect(input);
	};

	const handleKeyPress = (
		e: NativeSyntheticEvent<TextInputKeyPressEventData>
	) => {
		if (
			e.nativeEvent.key === 'Backspace' &&
			input.length === 0 &&
			selected.length > 0
		) {
			console.log('Backspace pressed');
			const last = selected[selected.length - 1];
			setSelected(selected.slice(0, -1));
			setInput(last);
			setError('');
		}
	};

	return (
		<View className="">
			<ThemedText style={labelStyle} className={`text-lg font-bold mb-2`}>
				{label}
			</ThemedText>
			<Animated.View style={{ minHeight: 48, height: animatedHeight }}>
				<View
					className="w-full border border-gray-300 rounded-md px-2 py-2"
					onLayout={onLayout}
				>
					<View className="flex flex-row flex-wrap items-center w-full ">
						{selected.map((item) => (
							<View
								key={item}
								className="bg-gray-200 px-2 py-1 rounded-full mr-2 mb-2 flex-row items-center max-w-[48%]"
							>
								<Text className="mr-1">{item}</Text>
								<Pressable onPress={() => removeTag(item)}>
									<Text className="text-red-500">×</Text>
								</Pressable>
							</View>
						))}

						{selected.length < MAX_SELECTION && (
							<ThemedTextInput
								className="min-w-[100px] min-h-[40px] border border-gray-300 rounded-md flex-1 mb-12"
								value={input}
								submitBehavior="submit"
								onChangeText={handleInputChange}
								onSubmitEditing={handleSubmit}
								onKeyPress={handleKeyPress}
								blurOnSubmit={false}
								multiline={false}
							/>
						)}
					</View>
				</View>
			</Animated.View>

			<View className="mt-1 flex-row justify-between items-center">
				{error.length > 0 ? (
					<Text className="text-red-500">{error}</Text>
				) : (
					<Text className="text-gray-500 text-sm">
						{selected.length} / {MAX_SELECTION} {namePlural}
					</Text>
				)}
			</View>

			{input.length > 0 &&
				filtered.length > 0 &&
				selected.length < MAX_SELECTION && (
					<View className="border mt-2 rounded-md bg-white">
						{filtered.map((item, index) => (
							<Pressable
								key={item}
								onPress={() => handleSelect(item)}
								className={`p-2 ${
									index < filtered.length - 1
										? 'border-b'
										: ''
								} hover:bg-gray-100`}
							>
								<Text>{item}</Text>
							</Pressable>
						))}
					</View>
				)}
		</View>
	);
}
