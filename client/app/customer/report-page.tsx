import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router, RelativePathString } from 'expo-router';
import FloatingBackArrowButton from '@/components/ui/FloatingBackArrowButton';
import ShowToast from '@/components/ui/ShowToast';
import LabeledInput from '@/components/ui/LabeledInput';
import { NormalizedImage } from '@/utils/functions';
import UserImage from '@/components/UserImage';
import { createReport } from '@/services/reportService';
import { FileObject } from '@/types/business';
import GalleryImageInput from '@/components/GalleryImageInput';

export default function AddReportPage() {
	const { businessName, businessId, businessImage, from } =
		useLocalSearchParams();
	const [description, setDescription] = useState('');
	const [loading, setLoading] = useState(false);
	const [files, setFiles] = useState<FileObject[]>([]);

	const handleSubmit = async () => {
		if (!description.trim()) {
			return ShowToast('error', 'Description is required');
		}

		setLoading(true);
		try {
			const image = files[0];
			await createReport(businessId as string, description, image as any);
			router.replace({ pathname: from as RelativePathString });
			setDescription('');
		} catch {
			ShowToast('error', 'Failed to submit report');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<FloatingBackArrowButton from={from as RelativePathString} />
			<ScrollView className="flex-1 bg-gray-100">
				<View className="px-6 pt-20 pb-8">
					<View className="items-center mb-12 mt-2">
						<UserImage
							image={NormalizedImage(businessImage)}
							className="items-center"
							size={36}
						/>
					</View>

					<Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
						New Report for {'\n'}
						{businessName}
					</Text>

					<LabeledInput
						label="Description"
						value={description}
						onChange={setDescription}
						multiline
					/>

					<GalleryImageInput
						labelClassName="mt-4"
						files={files}
						setFiles={setFiles}
						maxImages={1}
						label="Upload an optional image"
					/>

					<TouchableOpacity
						className={`mt-8 py-4 rounded-xl items-center ${
							loading ? 'bg-blue-300' : 'bg-blue-600'
						}`}
						onPress={handleSubmit}
						disabled={loading}
					>
						<Text className="text-white text-base font-semibold">
							{loading ? 'Submitting...' : 'Submit Report'}
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</>
	);
}
