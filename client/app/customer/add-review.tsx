import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	ScrollView,
	Alert,
} from 'react-native';
import HapticButton from '@/components/ui/HapticButton';
import UserImage from '@/components/UserImage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import GalleryImageInput from '@/components/GalleryImageInput';
import { FileObject } from '@/types/business';
import { createReview } from '@/services/ReviewService';
import ShowToast from '@/components/ui/ShowToast';
import { NormalizedImage } from '@/utils/functions';
import FloatingBackArrowButton from '@/components/ui/FloatingBackArrowButton';

const AddReview = () => {
	const router = useRouter();
	const { businessName, businessImage, transactionId } =
		useLocalSearchParams();
	const [reviewText, setReviewText] = useState('');
	const [images, setImages] = useState<FileObject[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		if (!reviewText.trim()) {
			ShowToast('error', 'Please enter your review before submitting.');
			return;
		}
		setIsSubmitting(true);
		try {
			const imageFiles = images.map(
				(image) =>
					({
						uri: image.uri,
						name: image.name || `image-${Date.now()}.jpg`,
						type: image.type || 'image/jpeg',
					} as any)
			);
			await createReview(transactionId as string, reviewText, imageFiles);
			ShowToast('success', 'Your review has been submitted!');
			router.back();
		} catch (error: any) {
			console.error('Error submitting review:', error);
			Alert.alert(
				'Error',
				error.message || 'Failed to submit review. Please try again.'
			);
		} finally {
			setIsSubmitting(false);
			setReviewText('');
			setImages([]);
		}
	};
	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			className="bg-white"
		>
			<FloatingBackArrowButton />
			<View className="flex-1 px-6 pb-8 pt-20">
				<Text className="text-2xl font-semibold text-gray-800 text-center mb-8">
					Tell us what you think about {'\n'} {businessName}
				</Text>
				<View className="items-center justify-center mb-8">
					<UserImage
						image={NormalizedImage(businessImage)}
						name={businessName as string}
						size={16}
						className="mb-2"
					/>
				</View>
				<TextInput
					placeholder="Enter your review"
					className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800 bg-white h-64 mb-6"
					multiline
					textAlignVertical="top"
					placeholderTextColor="#9CA3AF"
					value={reviewText}
					onChangeText={setReviewText}
				/>
				<GalleryImageInput
					files={images}
					setFiles={setImages}
					label="You can also add pictures"
					maxImages={5}
				/>
				<HapticButton
					onPress={handleSubmit}
					disabled={isSubmitting}
					className="mt-14"
				>
					<View className="bg-green-500 py-4 rounded-full">
						<Text className="text-white font-semibold text-center text-base">
							{isSubmitting ? 'Submitting...' : 'Submit Review'}
						</Text>
					</View>
				</HapticButton>
			</View>
		</ScrollView>
	);
};
export default AddReview;
