import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StarRating from "@/components/StarRating";
import HapticButton from "@/components/ui/HapticButton";
import { formatCurrencySymbol } from "@/utils/functions";

type Props = {
    item: any;
    returnDate: Date;
    onPressBusiness: () => void;
};

export default function TransactionSummaryCard({
    item,
    returnDate,
    onPressBusiness
}: Props) {
    const businessName = item.business?.name ?? "VIP User";
    const rating = item.business?.rating?.overall ?? 0;
    const formattedDate = returnDate.toLocaleDateString();
    const formattedTime = returnDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    return (
        <View className='mx-6 mt-8 bg-indigo-800 rounded-3xl p-6'>
            <View className='flex-row items-start pb-4 border-b border-white/20'>
                <View className='w-16 h-16 rounded-full bg-gray-300 items-center justify-center overflow-hidden mr-4'>
                    {item.business?.image ? (
                        <Image
                            source={{ uri: item.business.image }}
                            className='w-full h-full'
                        />
                    ) : (
                        <Ionicons
                            name='business-outline'
                            size={48}
                            color='white'
                        />
                    )}
                </View>

                <View className='flex-1'>
                    <Text className='text-white/90 text-lg font-semibold mb-1'>
                        {businessName}
                    </Text>
                    <View className='flex-row items-center'>
                        <StarRating rating={rating} />
                        <HapticButton
                            onPress={onPressBusiness}
                            className='ml-2 px-2 py-0.5 rounded-full bg-white/20'
                        >
                            <Text className='text-white text-xs font-medium'>
                                View Profile
                            </Text>
                        </HapticButton>
                    </View>
                </View>
            </View>

            <View className='mb-4 mt-4'>
                <Text className='text-white/70 text-lg mb-2 font-semibold text-center'>
                    The deposit fee is:
                </Text>
                <Text className='text-white text-3xl font-bold text-center'>
                    {item.amount} {formatCurrencySymbol(item.currency)}
                </Text>
            </View>

            <View className='mb-6'>
                <Text className='text-white text-xl font-semibold text-center'>
                    {item.description}
                </Text>
            </View>

            <View className='flex-row justify-between'>
                <View>
                    <Text className='text-white/70 text-lg font-semibold'>
                        Return date
                    </Text>
                    <Text className='text-white text-md mt-1 text-center font-semibold'>
                        {formattedDate}
                    </Text>
                </View>
                <View>
                    <Text className='text-white/70 text-lg font-semibold'>
                        Return time
                    </Text>
                    <Text className='text-white text-md mt-1 text-center font-semibold'>
                        {formattedTime}
                    </Text>
                </View>
            </View>
        </View>
    );
}
