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
			aspect: [1, 1], // Ensures the image is cropped to a square aspect ratio
			quality: 1,
		});

		if (!result.canceled) {
			const temp_uri = result.assets[0].uri;
			setUri(temp_uri);
			setFile(result.assets[0].file!);
			console.log('Picked image URI:', temp_uri);
			// You can now upload this URI or display it as a rounded image
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
					style={{
						width: 100,
						height: 100,
						borderRadius: 50,
						backgroundColor: '#E0E0E0',
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 10,
						overflow: 'hidden',
					}}
				>
					{uri ? (
						// Display the selected image
						<Image
							source={{ uri }}
							style={{ width: '100%', height: '100%' }}
						/>
					) : (
						// Display the "Upload" text when no image is selected
						<Text onPress={pickImage} style={{ color: '#888' }}>
							Upload
						</Text>
					)}
				</HapticButton>
				{uri && (
					// Display "Update" and "Delete" options when an image is selected
					<View
						style={{
							marginTop: 10,
							flexDirection: 'column',
							gap: 10,
						}}
					>
						<Text
							onPress={() => {
								setUri(null);
								setFile(null);
							}}
							style={{
								color: '#FF0000',
								textDecorationLine: 'underline',
							}}
						>
							Delete Image
						</Text>
					</View>
				)}
			</View>
		</View>
	);
}
