import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, Image, ScrollView } from 'react-native';
import HapticButton from '@/components/ui/HapticButton';
import { ThemedText } from './ui/ThemedText';
import { FileObject } from '@/types/business';

interface GalleryImageInputProps {
	setFiles: (files: FileObject[]) => void;
	files: FileObject[];
	label?: string;
	labelClassName?: string;
	containerClassName?: string;
	themeText?: boolean;
	maxImages?: number;
}

export default function GalleryImageInput({
	setFiles,
	files,
	label,
	labelClassName,
	containerClassName,
	themeText = true,
	maxImages = 5,
}: GalleryImageInputProps) {
	const pickImages = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsMultipleSelection: true,
			selectionLimit: maxImages - files.length,
			quality: 1,
		});

		if (!result.canceled) {
			const newFiles = result.assets.map((asset) => ({
				uri: asset.uri,
				name: asset.fileName || 'image.jpg',
				type: 'image/jpeg',
			}));
			setFiles([...files, ...newFiles]);
		}
	};

	const removeImage = (index: number) => {
		const updatedFiles = [...files];
		updatedFiles.splice(index, 1);
		setFiles(updatedFiles);
	};

	return (
		<View className={`${containerClassName} flex-col gap-4`}>
			<View className="items-center">
				{themeText ? (
					<ThemedText
						className={`text-sm font-medium ${labelClassName}
						`}
						darkColor="black"
					>
						{label}
					</ThemedText>
				) : (
					<Text className={`text-lg font-lg ${labelClassName}`}>
						{label}
					</Text>
				)}
			</View>

			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				className="flex-row gap-2 mt-2"
			>
				{files.map((file, index) => (
					<View key={index} className="relative">
						<Image
							source={{ uri: file.uri }}
							className="w-24 h-24 rounded-md"
						/>
						<Text
							onPress={() => removeImage(index)}
							className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs rounded-full"
						>
							✕
						</Text>
					</View>
				))}
				{files.length < maxImages && (
					<HapticButton
						onPress={pickImages}
						className="w-24 h-24 rounded-md bg-gray-200 justify-center items-center"
					>
						<Text className="text-gray-500">+ Add</Text>
					</HapticButton>
				)}
			</ScrollView>
		</View>
	);
}
