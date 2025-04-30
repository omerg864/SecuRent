import React, { useEffect, useState } from "react";
import {
    View,
    Image,
    ScrollView,
    ActivityIndicator,
    Text,
    TouchableOpacity
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import HapticButton from "@/components/ui/HapticButton";
import { getItemById, getItemByIdForBusiness } from "@/services/itemService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";

const ItemProfileScreen = () => {
    const id = "6811141b2063b90e2720c1e0"; // temp ID
    const router = useRouter();

    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [accountType, setAccountType] = useState<string | null>(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const type = await AsyncStorage.getItem("current_account_type");
                setAccountType(type);

                const data =
                    type === "business"
                        ? await getItemByIdForBusiness(id)
                        : await getItemById(id);

                setItem(data.item);
            } catch (error) {
                Toast.show({ type: "error", text1: "Failed to load item" });
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    const handlePress = () => {
        router.push({
            pathname: "/customer/approve-transaction",
            params: { id }
        } as const);
    };

    if (loading) {
        return (
            <View className='flex-1 justify-center items-center bg-white'>
                <ActivityIndicator
                    size='large'
                    color='#000'
                />
            </View>
        );
    }

    if (!item) {
        return (
            <View className='flex-1 justify-center items-center bg-white'>
                <Text className='text-black'>Item not found</Text>
            </View>
        );
    }

    return (
        <ParallaxScrollView
            headerImage={
                item.image ? (
                    <Image
                        source={{ uri: item.image }}
                        className='w-full h-full'
                        resizeMode='cover'
                    />
                ) : (
                    <View className='w-full h-full justify-center items-center bg-gray-400'>
                        <Ionicons
                            name='image-outline'
                            size={64}
                            color='white'
                        />
                    </View>
                )
            }
            headerBackgroundColor={{ light: "#ffffff", dark: "#ffffff" }}
            onBack={() => router.back()}
        >
            <ScrollView className='bg-white px-4 pb-8'>
                {/* Description */}
                <Text className='text-2xl font-bold text-black mb-6 mt-6'>
                    {item.description}
                </Text>

                {/* Item Details Block */}
                <View className='bg-gray-100 rounded-2xl p-5 space-y-6 mb-10 mt4'>
                    {/* Rental Duration */}
                    <View className='flex-row items-center justify-between mb-2 mt-2'>
                        <View className='flex-row items-center'>
                            <Ionicons
                                name='time-outline'
                                size={22}
                                color='#666'
                            />
                            <Text className='ml-2 text-base text-gray-500'>
                                Rental Duration
                            </Text>
                        </View>
                        <Text className='text-xl font-bold text-black'>
                            {item.duration
                                ? `${item.duration} ${item.timeUnit}`
                                : "N/A"}
                        </Text>
                    </View>

                    {/* Divider */}
                    <View className='h-px bg-gray-300 my-2' />

                    {/* Deposit Price */}
                    <View className='flex-row items-center justify-between mb-2 mt-2'>
                        <View className='flex-row items-center'>
                            <Ionicons
                                name='cash-outline'
                                size={22}
                                color='#666'
                            />
                            <Text className='ml-2 text-base text-gray-500'>
                                Deposit Price
                            </Text>
                        </View>
                        <Text className='text-xl font-bold text-black'>
                            {item.price} {item.currency}
                        </Text>
                    </View>
                </View>

                {/* Action Button */}
                {accountType === "personal" && (
                    <HapticButton
                        onPress={() =>
                            router.push({
                                pathname: "/customer/approve-transaction",
                                params: { id }
                            } as const)
                        }
                        className='w-full h-16 bg-indigo-600 rounded-full justify-center items-center shadow-lg'
                    >
                        <Text className='text-white text-lg font-bold'>
                            Start your secuRent
                        </Text>
                    </HapticButton>
                )}
            </ScrollView>
        </ParallaxScrollView>
    );
};

export default ItemProfileScreen;
