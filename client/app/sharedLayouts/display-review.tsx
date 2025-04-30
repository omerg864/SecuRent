import React, { useState, useMemo } from 'react';
import {
	View,
	Text,
	ScrollView,
	Image,
	SafeAreaView,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import UserImage from '@/components/UserImage';
import FloatingBackArrowButton from '@/components/ui/FloatingBackArrowButton';
import { BaseModal } from '@/components/BaseModal';
import { NormalizedImage } from '@/utils/functions';

const { width, height } = Dimensions.get('window');

const DisplayReview = () => {
	const {
		userName,
		userImage,
		reviewText,
		reviewImages,
		businessName,
		businessImage,
		createdAt,
	} = useLocalSearchParams();
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const parsedImages = useMemo(() => {
		try {
			if (typeof reviewImages === 'string') {
				const parsed = JSON.parse(reviewImages);
				return Array.isArray(parsed) ? parsed : [];
			}
		} catch (err) {
			console.warn('Failed to parse review images:', err);
		}
		return [];
	}, [reviewImages]);
	const displayDate = () => {
		const date = new Date(createdAt as string);
		return date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};
	const handleImagePress = (uri: string) => {
		setSelectedImage(uri);
		setModalVisible(true);
	};
	return (
		<SafeAreaView className="flex-1 bg-white">
			<FloatingBackArrowButton />
			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				className="px-6 pt-20"
			>
				<View className="flex-1 px-6 pb-10 pt-5">
					<View className="items-center justify-center mb-6">
						<UserImage
							image={NormalizedImage(businessImage)}
							name={businessName as string}
							size={16}
							className="mb-2"
						/>
						<Text className="text-2xl font-bold text-gray-800 text-center mt-8">
							Your review for {businessName}
						</Text>
					</View>
					<View className="flex-row items-center mb-8 space-x-4">
						<UserImage
							image={NormalizedImage(userImage)}
							name={NormalizedImage(userName)}
							size={16}
						/>
						<View>
							<Text className="text-lg font-semibold text-gray-800">
								{userName}
							</Text>
							<Text className="text-sm text-gray-500">
								{displayDate()}
							</Text>
						</View>
					</View>
					<View className="bg-gray-50 rounded-lg p-4 shadow-sm mb-8">
						<Text className="text-base text-gray-700 leading-relaxed">
							{reviewText}
						</Text>
					</View>
					{parsedImages.length > 0 && (
						<View>
							<Text className="text-lg font-semibold text-gray-800 mb-4">
								Shared Photos
							</Text>
							<View className="flex-row flex-wrap gap-3">
								{parsedImages.map((uri, index) => (
									<TouchableOpacity
										key={index}
										onPress={() => handleImagePress(uri)}
									>
										<Image
											source={{ uri }}
											style={{
												width: 80,
												height: 80,
												borderRadius: 10,
												backgroundColor: '#f0f0f0',
											}}
										/>
									</TouchableOpacity>
								))}
							</View>
						</View>
					)}
				</View>
			</ScrollView>
			<BaseModal
				visible={modalVisible}
				onClose={() => setModalVisible(false)}
			>
				{selectedImage && (
					<Image
						source={{ uri: selectedImage }}
						style={{
							width: width * 0.9,
							height: height * 0.6,
							borderRadius: 12,
							resizeMode: 'contain',
						}}
					/>
				)}
			</BaseModal>
		</SafeAreaView>
	);
};

export default DisplayReview;
