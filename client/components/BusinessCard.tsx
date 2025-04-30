import { Image, Text, View } from 'react-native';
import StarRating from './StarRating';
import HapticButton from '@/components/ui/HapticButton';
import { Business } from '@/services/interfaceService';
import * as Haptics from "expo-haptics";

interface BusinessCardProps {
	business: Business;
	onPress: () => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({   onPress, business }) => {
	  const handlePress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		onPress();
	  };
	return (
		<HapticButton
			className="bg-indigo-700 rounded-lg p-4 mb-4"
			onPress={handlePress}
		>
			<View className="flex-row items-center">
				<View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-3">
					<Image
						source={require('../assets/images/location-icon.png')}
						className="w-8 h-8"
					/>
				</View>
				<View className="flex-1">
					<View className="flex-row justify-between items-center">
						<Text className="text-white font-bold text-lg">
							{business.name}
						</Text>
						<Text className="text-white text-sm">
							{(business.distance || 0).toFixed(2)} km away
						</Text>
					</View>
					<Text className="text-white text-sm">
						{business.address}
					</Text>
				</View>
			</View>
			<View className="flex-row justify-between mt-2">
				<Text className="text-white">{business.category}</Text>
				<StarRating rating={business.rating.overall} />
			</View>
		</HapticButton>
	);
};

export default BusinessCard;
