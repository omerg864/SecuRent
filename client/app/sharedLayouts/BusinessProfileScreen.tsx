"use client";

import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { View, Image, Linking, ScrollView, Text } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
    useRouter,
    useLocalSearchParams,
    RelativePathString
} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import HapticButton from "@/components/ui/HapticButton";
import ShowToast from "@/components/ui/ShowToast";
import StarRating from "@/components/StarRating";
import { getBusinessProfile } from "@/services/businessService";
import { deleteItem } from "@/services/itemService";
import UserImage from "@/components/UserImage";
import { BusinessDetails } from "@/services/interfaceService";
import { currencies } from "@/utils/constants";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import WarningPopupModal from "@/components/ui/WarningPopUpModal";
import { CURRENT_ACCOUNT_TYPE, USER_ID } from "@/utils/asyncStorageConstants";


const BusinessProfileScreen = () => {
    const [activeTab, setActiveTab] = useState("items");
    const [businessData, setBusinessData] = useState<BusinessDetails | null>(
        null
    );
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isBusiness, setIsBusiness] = useState(false);
    const [accountType, setAccountType] = useState("");
    const [myFrom, setMyFrom] = useState("");

    const router = useRouter();
    const params = useLocalSearchParams();

    useFocusEffect(
        useCallback(() => {
            const fetchBusinessData = async () => {
                try {
                    setIsLoading(true);
                    const storedUserId = await AsyncStorage.getItem(USER_ID);
                    const typeOfAccount = await AsyncStorage.getItem(
                        CURRENT_ACCOUNT_TYPE
                    );
                    setAccountType(
                        typeOfAccount === "business" ? "business" : "personal"
                    );
                    const id: any = params.id || storedUserId;
                    setIsBusiness(!params.id);
                    if (params.id == storedUserId) {
                        setIsBusiness(true);
                    }
                    setMyFrom(
                        typeOfAccount === "business"
                            ? `/business/BusinessProfileScreen?id=${id}`
                            : `/customer/BusinessProfileScreen?id=${id}`
                    );
                    const data = await getBusinessProfile(id);
                    setBusinessData(data);
                } catch (error: any) {
                    ShowToast("error", error.message);
                    router.back();
                } finally {
                    setIsLoading(false);
                }
            };

            fetchBusinessData();
        }, [params.id, params.from])
    );

    const handleCall = () => {
        if (businessData) Linking.openURL(`tel:${businessData.business.phone}`);
    };

    const handleOpenReportModal = () => {
        setReportModalVisible(true);
    };

    const handleCloseReportModal = () => {
        setReportModalVisible(false);
    };

    const handleAcceptReporting = () => {
        // Handle report submission logic here
        router.push({
            pathname: "/customer/report-page",
            params: {
                businessName: business.name,
                businessImage: business.image,
                businessId: business._id as string,
                from: myFrom
            }
        });
        setReportModalVisible(false);
    };

    const handleNavigate = () => {
        if (businessData) {
            const [lng, lat] = businessData.business.location?.coordinates || [
                34.792611, 32.074983
            ];
            const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
            Linking.canOpenURL(url).then((supported) => {
                supported
                    ? Linking.openURL(url)
                    : ShowToast("error", "Google Maps is not available");
            });
        }
    };

    const handleEdit = (item: any) => {
        router.push({
            pathname: "/business/edit-item",
            params: { id: item._id }
        });
    };

    const handleDelete = async (item: any) => {
        try {
            await deleteItem(item._id);
            ShowToast("success", `${item.description} deleted successfully`);
            setBusinessData((prev: any) => ({
                ...prev,
                items: prev.items.filter((i: any) => i._id !== item._id)
            }));
        } catch {
            ShowToast("error", "Failed to delete item");
        }
    };

    const handleQRCode = (item: any) => {
        router.push({
            pathname: "/business/QRCodeScreen",
            params: { id: item._id, from: "ProfilePage" }
        });
    };

    const handleReviewPress = (review: any) => {
        router.push({
            pathname: "/customer/display-review",
            params: {
                from: myFrom as RelativePathString,
                userName: review.customer.name,
                userImage: review.customer.image,
                reviewText: review.content,
                reviewImages: JSON.stringify(review.images),
                businessName: businessData?.business.name,
                businessImage: businessData?.business.image,
                createdAt: review.createdAt
            }
        });
    };

    const handleItemPress = async (item: any) => {
        if (accountType === "personal") {
            router.push({
                pathname: "/customer/item-profile",
                params: {
                    businessId: params.id,
                    id: item._id,
                    from: myFrom as RelativePathString
                }
            });
        } else {
            router.push({
                pathname: "/business/item-profile",
                params: {
                    id: item._id,
                    from: myFrom as RelativePathString
                }
            });
        }
    };

    if (isLoading) return <LoadingSpinner label='loading profile...' />;

    if (!businessData) return null;

    const { business, items = [], reviews = [] } = businessData;

    return (
        <>
            <View className='absolute top-6 right-5 z-10'>
                {accountType === "personal" && (
                    <HapticButton
                        onPress={handleOpenReportModal}
                        className='bg-gray-100 px-4 py-2 rounded-full'
                    >
                        <ThemedText
                            style={{ color: "#dc2626", fontWeight: "600" }}
                        >
                            Report
                        </ThemedText>
                    </HapticButton>
                )}
            </View>
            <ParallaxScrollView
                headerImage={
                    business.image ? (
                        <Image
                            source={{ uri: business.image }}
                            className='w-full h-full'
                            resizeMode='cover'
                        />
                    ) : (
                        <View className='w-full h-full justify-center items-center bg-gray-400'>
                            <Ionicons
                                name='business-outline'
                                size={108}
                                color='white'
                            />
                        </View>
                    )
                }
                headerBackgroundColor={{ light: "#ffffff", dark: "#ffffff" }}
                onBack={() => {
                    if (typeof params.from === "string") {
                        router.replace({
                            pathname: params.from as RelativePathString
                        });
                    } else {
                        router.back();
                    }
                }}
            >
                <ScrollView className='bg-white'>
                    <ThemedView
                        className='px-4 py-6'
                        darkColor='white'
                    >
                        <View className='flex-row justify-between w-full'>
                            <ThemedText
                                type='title'
                                className='text-2xl font-bold text-black'
                                darkColor='black'
                            >
                                {business.name}
                            </ThemedText>
                        </View>
                        <View className='flex-row items-center my-3'>
                            <StarRating
                                rating={business.rating.overall}
                                size={20}
                            />
                            <ThemedText
                                className='ml-2 text-black'
                                darkColor='black'
                            >
                                {business.rating.overall.toFixed(1)}
                            </ThemedText>
                        </View>

                        {business.category?.length > 0 && (
                            <View className='flex-row items-center mb-3'>
                                <MaterialIcons
                                    name='category'
                                    size={18}
                                    color='#666'
                                />
                                <ThemedText
                                    className='ml-2 text-black'
                                    darkColor='black'
                                >
                                    {business.category[0]}
                                </ThemedText>
                            </View>
                        )}

                        <View className='flex-row items-start justify-between mb-4'>
                            <Ionicons
                                name='location-outline'
                                size={18}
                                color='#666'
                            />
                            <ThemedText
                                className='ml-2 flex-1 text-black'
                                darkColor='black'
                            >
                                {business.address}
                            </ThemedText>
                            <HapticButton
                                onPress={handleNavigate}
                                className='bg-blue-500 rounded-full p-2 ml-2'
                            >
                                <Ionicons
                                    name='navigate'
                                    size={20}
                                    color='white'
                                />
                            </HapticButton>
                        </View>

                        <View className='flex-row items-center justify-between mb-4'>
                            <Ionicons
                                name='call-outline'
                                size={18}
                                color='#666'
                            />
                            <ThemedText
                                className='ml-2 flex-1 text-black'
                                darkColor='black'
                            >
                                {business.phone}
                            </ThemedText>
                            <HapticButton
                                onPress={handleCall}
                                className='bg-green-500 rounded-full p-2 ml-2'
                            >
                                <Ionicons
                                    name='call'
                                    size={20}
                                    color='white'
                                />
                            </HapticButton>
                        </View>
                    </ThemedView>

                    {/* Tabs */}
                    <View className='flex-row border-b border-gray-300'>
                        {["items", "reviews"].map((tab) => (
                            <HapticButton
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                className={`flex-1 py-3 ${
                                    activeTab === tab
                                        ? "border-b-2 border-[#4338CA]"
                                        : ""
                                }`}
                            >
                                <ThemedText
                                    className={`text-center ${
                                        activeTab === tab
                                            ? "font-bold text-blue-500"
                                            : "text-black"
                                    }`}
                                    darkColor='black'
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </ThemedText>
                            </HapticButton>
                        ))}
                    </View>

                    {activeTab === "items" ? (
                        <View className='p-4 bg-white'>
                            {items.length === 0 ? (
                                <View className='items-center justify-center py-10'>
                                    <ThemedText
                                        type='defaultSemiBold'
                                        className='text-gray-400 text-lg'
                                        darkColor='gray'
                                    >
                                        No items yet...
                                    </ThemedText>
                                </View>
                            ) : (
                                items.map((item: any) => (
                                    <HapticButton
                                        key={item._id}
                                        onPress={() => handleItemPress(item)}
                                        className='flex-row mb-6 bg-white rounded-lg p-3 shadow items-center'
                                    >
                                        <View className='flex-row items-center flex-1'>
                                            {item.image ? (
                                                <Image
                                                    source={{ uri: item.image }}
                                                    className='w-20 h-20 rounded-lg'
                                                    resizeMode='cover'
                                                />
                                            ) : (
												<View className='w-20 h-20 rounded-lg bg-gray-400 justify-center items-center'>
												<Ionicons
													name='image-outline'
													size={40}
													color='white' 
												/>
												<Text className='text-white text-xs font-bold'>
													No image
												</Text>
											</View>
											
                                            )}
                                            <View className='ml-3 flex-1'>
                                                <ThemedText
                                                    type='defaultSemiBold'
                                                    className='text-black mb-1'
                                                    darkColor='black'
                                                >
                                                    {item.description}
                                                </ThemedText>

                                                <View>
                                                    <ThemedText
                                                        type='defaultSemiBold'
                                                        className='text-green-600'
                                                        darkColor='black'
                                                    >
                                                        {item.price}{" "}
                                                        {currencies.find(
                                                            (currency) =>
                                                                currency.code ===
                                                                item.currency
                                                        )?.symbol || "₪"}
                                                    </ThemedText>
                                                    <View className='flex-row items-center mt-1'>
                                                        <Ionicons
                                                            name='time-outline'
                                                            size={14}
                                                            color='#666'
                                                        />
                                                        <ThemedText
                                                            className='text-xs ml-1 text-gray-500'
                                                            darkColor='black'
                                                        >
                                                            {item.duration}{" "}
                                                            {item.timeUnit}
                                                        </ThemedText>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        {isBusiness && (
                                            <View className='flex-row ml-4'>
                                                <HapticButton
                                                    onPress={() =>
                                                        handleEdit(item)
                                                    }
                                                    className='bg-[#4338CA] rounded-full p-2.5'
                                                >
                                                    <Ionicons
                                                        name='create-outline'
                                                        size={20}
                                                        color='white'
                                                    />
                                                </HapticButton>
                                                <HapticButton
                                                    onPress={() =>
                                                        handleDelete(item)
                                                    }
                                                    className='bg-[#4338CA] rounded-full p-2.5 ml-2'
                                                >
                                                    <Ionicons
                                                        name='trash-outline'
                                                        size={20}
                                                        color='white'
                                                    />
                                                </HapticButton>
                                                <HapticButton
                                                    onPress={() =>
                                                        handleQRCode(item)
                                                    }
                                                    className='bg-[#4338CA] rounded-full p-2.5 ml-2'
                                                >
                                                    <Ionicons
                                                        name='qr-code-outline'
                                                        size={20}
                                                        color='white'
                                                    />
                                                </HapticButton>
                                            </View>
                                        )}
                                    </HapticButton>
                                ))
                            )}

                            {/* Overlay */}
                            {business?.suspended && (
                                <View className='absolute inset-0 bg-gray-100/95 z-10 flex items-center justify-center px-6'>
                                    <ThemedText
                                        className='text-center font-bold'
                                        style={{
                                            color: "#dc2626",
                                            fontSize: 16
                                        }}
                                    >
                                        ⚠️ New transactions are temporarily
                                        unavailable, returns are still possible.
                                    </ThemedText>
                                </View>
                            )}
                        </View>
                    ) : (
                        <View className='p-4'>
                            <ThemedText
                                className='font-semibold mb-2 text-black'
                                darkColor='black'
                            >
                                Review Summary
                            </ThemedText>
                            <ThemedText
                                className='text-gray-500 mb-4'
                                darkColor='black'
                            >
                                {business.reviewSummary || "No reviews yet..."}
                            </ThemedText>
                            {reviews.map((review: any) => {
                                const createdAt = new Date(
                                    review.createdAt
                                ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric"
                                });

                                return (
                                    <HapticButton
                                        key={review._id}
                                        onPress={() =>
                                            handleReviewPress(review)
                                        }
                                        className='bg-white rounded-lg p-4 mb-4 shadow'
                                    >
                                        <View className='flex-row justify-between items-center mb-2'>
                                            <View className='flex-row items-center'>
                                                <UserImage
                                                    image={
                                                        review.customer.image
                                                    }
                                                    name={review.customer.name}
                                                    size={12}
                                                />
                                                <ThemedText
                                                    className='ml-2 font-semibold text-black'
                                                    darkColor='black'
                                                >
                                                    {review.customer.name}
                                                </ThemedText>
                                            </View>
                                            <ThemedText
                                                className='text-xs text-gray-400'
                                                darkColor='gray'
                                            >
                                                {createdAt}
                                            </ThemedText>
                                        </View>
                                        <ThemedText
                                            className='text-gray-700'
                                            darkColor='black'
                                        >
                                            {review.content.trim()}
                                        </ThemedText>
                                    </HapticButton>
                                );
                            })}
                        </View>
                    )}
                </ScrollView>
                <WarningPopupModal
                    visible={reportModalVisible}
                    onClose={handleCloseReportModal}
                    onConfirm={handleAcceptReporting}
                    title='Report Business'
                    message={`Do you want to file a report for ${business.name}`}
                    confirmText='Yes'
                    cancelText='No'
                    iconName='warning'
                    iconColor='red'
                />
            </ParallaxScrollView>
        </>
    );
};

export default BusinessProfileScreen;
