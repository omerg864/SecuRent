import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useLocalSearchParams, router, RelativePathString } from 'expo-router';
import FloatingBackArrowButton from '@/components/ui/FloatingBackArrowButton';
import ShowToast from '@/components/ui/ShowToast';
import LabeledInput from '@/components/ui/LabeledInput';
import { NormalizedImage } from '@/utils/functions';
import UserImage from '@/components/UserImage';
import { createReport } from '@/services/reportService';
import GalleryImageInput from '@/components/GalleryImageInput';
import type { FileObject } from '@/types/business';
import SubmitButton from '@/components/ui/SubmitButton';

export default function AddReportPage() {
	const { businessName, businessId, businessImage, from } =
		useLocalSearchParams();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [images, setImages] = useState<FileObject[]>([]);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		if (!description.trim() || !title.trim())
			return ShowToast('error', 'All fields needs to be filled');
		setLoading(true);
		try {
			const imageFiles = images.map(({ uri, name, type }) => ({
				uri,
				name: name || `image-${Date.now()}.jpg`,
				type: type || 'image/jpeg',
			}));
			await createReport(
				businessId as string,
				title,
				description,
				imageFiles as any
			);
			router.replace({ pathname: from as RelativePathString });
		} catch {
			ShowToast('error', 'Failed to submit report');
		} finally {
			setDescription('');
			setTitle('');
			setImages([]);
			setLoading(false);
		}
	};

	return (
		<>
			<FloatingBackArrowButton from={from as RelativePathString} />
			<ScrollView className="flex-1 bg-gray-100">
				<View className="px-6 pt-16 pb-8">
					<View className="items-center mb-6 mt-2">
						<UserImage
							image={NormalizedImage(businessImage)}
							size={36}
							className="items-center"
						/>
					</View>
					<Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
						Report for {'\n'} {businessName}
					</Text>
					<LabeledInput
						label="Title"
						value={title}
						onChange={setTitle}
					/>
					<LabeledInput
						label="Description"
						value={description}
						onChange={setDescription}
						multiline
					/>
					<GalleryImageInput
						label="Upload an optional image"
						labelClassName="mt-4"
						files={images}
						setFiles={setImages}
						maxImages={5}
					/>
					<SubmitButton
						onPress={handleSubmit}
						disabled={loading}
						loading={loading}
						label="Submit Review"
						color="bg-red-500"
						className="mt-4"
					/>
				</View>
			</ScrollView>
		</>
	);
}
