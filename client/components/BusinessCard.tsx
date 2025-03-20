import { Image, Text, View } from 'react-native';
import { Business } from '../types/business';
import StarRating from './StarRating';
import HapticButton from '@/components/ui/HapticButton';

interface BusinessCardProps {
	business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
	return (
		<HapticButton className="bg-indigo-700 rounded-lg p-4 mb-4" onPress={() => {}}>
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
							{business.distance} km away
						</Text>
					</View>
					<Text className="text-white text-sm">
						{business.address}
					</Text>
				</View>
			</View>
			<View className="flex-row justify-between mt-2">
				<Text className="text-white">{business.category}</Text>
				<StarRating rating={business.rating} />
			</View>
		</HapticButton>
	);
};

export default BusinessCard;
