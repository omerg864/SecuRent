import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import HapticButton from '@/components/ui/HapticButton';
import UserImage from '@/components/UserImage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import GalleryImageInput from '@/components/GalleryImageInput';
import { FileObject } from '@/types/business';
import { createReview } from '@/services/ReviewService';
import ShowToast from '@/components/ui/ShowToast';

const AddReview = () => {
	const { businessName, businessImage, transactionId } =
		useLocalSearchParams();
	const router = useRouter();

	const [reviewText, setReviewText] = useState('');
	const [images, setImages] = useState<FileObject[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		if (!reviewText.trim()) {
			ShowToast('error', 'Please enter your review before submitting.');
			return;
		}

		if (!transactionId) {
			Alert.alert('Error', 'Transaction ID is missing');
			return;
		}

		setIsSubmitting(true);

		try {
			// Convert FileObject array to File array expected by createReview
			const imageFiles = images.map((image) => {
				// In React Native, we need to create a special object that the server
				// will recognize as a file when sent in FormData
				return {
					uri: image.uri,
					name: image.name || `image-${Date.now()}.jpg`,
					type: image.type || 'image/jpeg',
				} as any;
			});

			// Call the createReview function from our service
			const result = await createReview(
				transactionId as string,
				reviewText,
				imageFiles
			);

			console.log('Review submitted successfully:', result);
			ShowToast('success', 'Your review has been submitted!');
			router.back(); // Navigate back after submission
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
			<View className="flex-1 px-6 pb-8 pt-40">
				<Text className="text-2xl font-semibold text-gray-800 text-center mb-8">
					Tell us what you think about {'\n'} {businessName}
				</Text>

				<View className="items-center justify-center mb-8">
					<UserImage
						image={
							Array.isArray(businessImage)
								? businessImage[0]
								: businessImage
						}
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
					label="You can also add some pictures"
					maxImages={5}
				/>

				<HapticButton
					onPress={handleSubmit}
					disabled={isSubmitting}
					className="mt-14"
				>
					<View className="bg-blue-600 py-4 rounded-lg">
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
