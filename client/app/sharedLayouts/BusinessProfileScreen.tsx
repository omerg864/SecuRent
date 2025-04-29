"use client";

import { useState, useEffect } from "react";
import { View, Image, Linking, Text } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import HapticButton from "@/components/ui/HapticButton";
import ShowToast from "@/components/ui/ShowToast";
import { useRouter } from "expo-router";
import StarRating from "@/components/StarRating";
import { useLocalSearchParams } from "expo-router";
import { getBusinessProfile } from "@/services/businessService"; // Ensure this function is imported
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteItem } from "@/services/itemService";

const BusinessProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("items");
  const [businessData, setBusinessData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useLocalSearchParams();
  let businessId: any = params.id as string;
  const [isBusiness, setIsBusiness] = useState(false); // State to track if the user is a business

  useEffect(() => {
    // Fetch the business profile data using the ID from the params
    const fetchBusinessData = async () => {
      try {
        setIsLoading(true);
        const userId = (await AsyncStorage.getItem("UserID")) || "";
        if (!businessId) {
          businessId = userId;
          setIsBusiness(true); // Set isBusiness to true if the businessId is not provided
        }
        const data = await getBusinessProfile(businessId); // Fetch data from the backend
        console.log("Business data fetched");
        setBusinessData(data);
      } catch (error) {
        ShowToast("error", "Failed to fetch business data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessData();
  }, [businessId]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-4 text-gray-600">Loading Profile...</Text>
      </View>
    );
  }

  if (!businessData) {
    console.log("Business data is null or undefined");
    router.back(); 
    ShowToast("error", "Business not found");
  }

  const { business, items, reviews } = businessData;

  const handleEdit = (item: any) => {
    ShowToast("success", `${item.description} edited successfully`);
  };

  const handleDelete =  async (item: any) => {
    try {
      await deleteItem(item._id);
      ShowToast("success", `${item.description} deleted successfully`);
      setBusinessData((prevData: any) => ({
        ...prevData,
        items: prevData.items.filter((i: any) => i._id !== item._id),
      }));
    } catch (error) {
      ShowToast("error", "Failed to delete item");
    }
  };

  const handleQRCode = (item: any) => {
    router.push({
      pathname: "/business/QRCodeScreen",
      params: {
        id: item._id,
      },
    });
  };

  const handleCall = () => {
    Linking.openURL(`tel:${business.phone}`);
  };

  const handleNavigate = () => {
    const lat = business?.location?.coordinates?.[0];
    const lng = business?.location?.coordinates?.[1];
    const latLng = lat && lng ? `${lat},${lng}` : "32.074983,34.792611";
    const url = `waze://?ll=${latLng}&navigate=yes`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          ShowToast("error", "Waze is not installed");
        }
      })
      .catch(() => ShowToast("error", "An error occurred while opening Waze"));
  };

  return (
    <ParallaxScrollView
      headerImage={
        business.image ? (
          <Image
            source={{ uri: business.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full justify-center items-center bg-gray-400">
            <Ionicons name="business-outline" size={108} color="white" />
          </View>
        )
      }
      headerBackgroundColor={{ light: "#ffffff", dark: "#ffffff" }}
      onBack={() => router.back()}
    >
      <View className="flex flex-col bg-white">
        {/* Business Details */}
        <ThemedView className="px-4 py-6 bg-white" darkColor="#ffffff">
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText type="title" className="text-2xl font-bold text-black" darkColor="black">
              {business.name}
            </ThemedText>
          </View>
  
          <View className="flex-row items-center mb-3">
            <StarRating rating={business.rating.overall} size={20} />
            <ThemedText className="ml-2 text-black" darkColor="black">
              {business.rating.overall}
            </ThemedText>
          </View>
  
          {business.category.length > 0 && (
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="category" size={18} color="#666" />
              <ThemedText className="ml-2 text-black" darkColor="black">
                {business.category[0]}
              </ThemedText>
            </View>
          )}
  
          <View className="flex-row items-start mb-4">
            <Ionicons name="location-outline" size={18} color="#666" style={{ marginTop: 3 }} />
            <ThemedText className="ml-2 flex-1 text-black" darkColor="black">
              {business.address}
            </ThemedText>
            <HapticButton onPress={handleNavigate} className="bg-blue-500 rounded-full p-2 ml-2">
              <Ionicons name="navigate" size={20} color="white" />
            </HapticButton>
          </View>
  
          <View className="flex-row items-center mb-4">
            <Ionicons name="call-outline" size={18} color="#666" />
            <ThemedText className="ml-2 flex-1 text-black" darkColor="black">
              {business.phone}
            </ThemedText>
            <HapticButton onPress={handleCall} className="bg-green-500 rounded-full p-2 ml-2">
              <Ionicons name="call" size={20} color="white" />
            </HapticButton>
          </View>
        </ThemedView>
  
        {/* Tabs */}
        <View className="flex-row border-b border-gray-300 bg-white">
          <HapticButton
            onPress={() => setActiveTab("items")}
            className={`flex-1 py-3 ${activeTab === "items" ? "border-b-2 border-[#4338CA]" : ""}`}
          >
            <ThemedText className={`text-center ${activeTab === "items" ? "font-bold text-blue-500" : "text-black"}`} darkColor="black">
              Items
            </ThemedText>
          </HapticButton>
          <HapticButton
            onPress={() => setActiveTab("reviews")}
            className={`flex-1 py-3 ${activeTab === "reviews" ? "border-b-2 border-[#4338CA]" : ""}`}
          >
            <ThemedText className={`text-center ${activeTab === "reviews" ? "font-bold text-blue-500" : "text-black"}`} darkColor="black">
              Reviews
            </ThemedText>
          </HapticButton>
        </View>
  
        {/* Active Tab Content */}
        {activeTab === "items" ? (
          <View className="p-4 bg-white">
            {items.length === 0 ? (
              <View className="items-center justify-center py-10">
                <ThemedText type="defaultSemiBold" className="text-gray-400 text-lg" darkColor="gray">
                  No items yet...
                </ThemedText>
              </View>
            ) : (
              items.map((item: any) => (
                <HapticButton
                  key={item._id}
                  onPress={() => router.push({ pathname: "./business/ItemDetails", params: { id: item._id } })}
                  className="flex-row mb-6 bg-white rounded-lg p-3 shadow items-center"
                >
                  <View className="flex-row items-center flex-1">
                    <Image
                      source={{ uri: item.image }}
                      className="w-20 h-20 rounded-lg"
                      resizeMode="cover"
                    />
                    <View className="ml-3 flex-1">
                      <ThemedText type="defaultSemiBold" className="text-black mb-1" darkColor="black">
                        {item.description}
                      </ThemedText>
  
                      <View className="flex-row items-center justify-between">
                        <ThemedText type="defaultSemiBold" className="text-green-600" darkColor="black">
                          {item.price} {business.currency}
                        </ThemedText>
                        <View className="flex-row items-center">
                          <Ionicons name="time-outline" size={14} color="#666" />
                          <ThemedText className="text-xs ml-1 text-gray-500" darkColor="black">
                            {item.duration} {item.timeUnit}
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                  </View>
  
                  {isBusiness && (
                    <View className="flex-row ml-4">
                      <HapticButton onPress={() => handleEdit(item)} className="bg-[#4338CA] rounded-full p-2.5">
                        <Ionicons name="create-outline" size={20} color="white" />
                      </HapticButton>
                      <HapticButton onPress={() => handleDelete(item)} className="bg-[#4338CA] rounded-full p-2.5 ml-2">
                        <Ionicons name="trash-outline" size={20} color="white" />
                      </HapticButton>
                      <HapticButton onPress={() => handleQRCode(item)} className="bg-[#4338CA] rounded-full p-2.5 ml-2">
                        <Ionicons name="qr-code-outline" size={20} color="white" />
                      </HapticButton>
                    </View>
                  )}
                </HapticButton>
              ))
            )}
          </View>
        ) : (
          <View className="p-4 bg-white">
            <View className="bg-white rounded-lg p-4 mb-6 shadow">
              <ThemedText type="defaultSemiBold" className="mb-2 text-black" darkColor="black">
                Review Summary
              </ThemedText>
              <ThemedText className="text-gray-500" darkColor="black">
                {business.reviewSummary || "No reviews yet..."}
              </ThemedText>
            </View>
  
            {reviews.map((review: any) => (
              <HapticButton
                key={review._id}
                onPress={() => router.push({ pathname: "./business/ReviewDetails", params: { id: review._id } })}
                className="bg-white rounded-lg p-4 mb-4 shadow"
              >
                <View className="flex-row items-center mb-3">
                  <Image
                    source={{ uri: review.customer.image }}
                    className="w-10 h-10 rounded-full"
                    resizeMode="cover"
                  />
                  <View className="ml-3">
                    <ThemedText type="defaultSemiBold" className="text-black" darkColor="black">
                      {review.customer.name}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText className="text-gray-700" darkColor="black">
                  {review.content}
                </ThemedText>
              </HapticButton>
            ))}
          </View>
        )}
      </View>
    </ParallaxScrollView>
  );
  
};

export default BusinessProfileScreen;
