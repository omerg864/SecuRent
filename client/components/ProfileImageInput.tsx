import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Button, Image, Text, View } from 'react-native';
import HapticButton from '@/components/ui/HapticButton';
import { ThemedText } from './ui/ThemedText';

interface ProfileImageInputProps {
	setFile: (file: File | null) => void;
	label?: string;
	labelClassName?: string;
}

export default function ProfileImageInput({
	setFile,
	label,
	labelClassName,
}: ProfileImageInputProps) {
	const [uri, setUri] = useState<string | null>(null);

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			const temp_uri = result.assets[0].uri;
			setUri(temp_uri);
			setFile(result.assets[0].file!);
		}
	};

	return (
		<View className="space-y-4 mt-8 flex-col gap-4">
			<View className="items-center">
				<ThemedText className={`text-sm font-medium ${labelClassName}`}>
					{label}
				</ThemedText>
				<HapticButton
					onPress={pickImage}
					className="w-24 h-24 rounded-full bg-gray-300 justify-center items-center mt-2 overflow-hidden"
				>
					{uri ? (
						<Image source={{ uri }} className="w-full h-full" />
					) : (
						<Text onPress={pickImage} className="text-gray-500">
							Upload
						</Text>
					)}
				</HapticButton>
				{uri && (
					<View className="mt-2 flex-col gap-2">
						<Text
							onPress={() => {
								setUri(null);
								setFile(null);
							}}
							className="text-red-500 underline"
						>
							Delete Image
						</Text>
					</View>
				)}
			</View>
		</View>
	);
}
