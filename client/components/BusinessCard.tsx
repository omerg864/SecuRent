import { Image, Text, View } from "react-native";
import StarRating from "./StarRating";
import HapticButton from "@/components/ui/HapticButton";
import { Business } from "@/services/interfaceService";
import * as Haptics from "expo-haptics";
import UserImage from "./UserImage";

interface BusinessCardProps {
  business: Business;
  onPress: () => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ onPress, business }) => {
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
        <UserImage
          image={business.image}
          name={business.name}
          size={12}
        />
        <View className="flex-1 ml-2">
          <View className="flex-row justify-between items-center">
            <Text className="text-white font-bold text-lg">
              {business.name}
            </Text>
            <Text className="text-white text-sm">
              {(business.distance || 0).toFixed(2)} km away
            </Text>
          </View>
          <Text className="text-white text-sm">{business.address}</Text>
        </View>
      </View>
      <View className="flex-row justify-between mt-2">
        <Text className="text-white">
          {business.category && business.category.length > 0
            ? business.category[0]
            : ""}
        </Text>
        <StarRating rating={business.rating.overall} />
      </View>
    </HapticButton>
  );
};

export default BusinessCard;
