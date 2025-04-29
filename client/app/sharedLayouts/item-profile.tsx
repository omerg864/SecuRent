import React, { useEffect, useState } from "react";
import { View, Image, ScrollView, ActivityIndicator, Text } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import HapticButton from "@/components/ui/HapticButton";
import { getItemById, getItemByIdForBusiness } from "@/services/itemService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const ItemProfileScreen = () => {
    const id = "6811141b2063b90e2720c1e0"; // temp ID for testing
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
        <SafeAreaView className='flex-1 bg-white'>
            <ScrollView className='px-4 pb-8'>
            <Text className="text-2xl font-bold text-center mb-4 text-black">
                    Item Details
                </Text>

                {item.image && (
                    <Image
                        source={{ uri: item.image }}
                        className='w-full h-64 rounded-2xl mb-4'
                        resizeMode='cover'
                    />
                )}

                <Text className='text-lg font-semibold mb-6 text-black'>
                    {item.description}
                </Text>

                <View className='space-y-8'>
                    <View className='flex-row justify-between items-center border-b border-gray-300 pb-4 pt-4'>
                        <Text className='text-base text-black'>
                            Rental Duration
                        </Text>
                        <Text className='text-base font-semibold text-black'>
                            {item.duration
                                ? `${item.duration} ${item.timeUnit}`
                                : "N/A"}
                        </Text>
                    </View>

                    <View className='flex-row justify-between items-center border-b border-gray-300 pb-4 pt-4'>
                        <Text className='text-base text-black'>
                            Deposit Price
                        </Text>
                        <Text className='text-base font-semibold text-black'>
                            {item.price} {item.currency}
                        </Text>
                    </View>
                </View>

                {accountType === "personal" && (
                    <View className='mt-10'>
                        <HapticButton
                            onPress={handlePress}
                            className='w-full h-14 bg-indigo-600 rounded-full justify-center items-center'
                        >
                            <Text className='text-white text-lg font-semibold'>
                                Start your secuRent
                            </Text>
                        </HapticButton>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ItemProfileScreen;
