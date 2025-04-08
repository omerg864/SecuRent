import { View, Text, Image, StatusBar, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/HapticButton";
import { router, useLocalSearchParams } from "expo-router";
import HapticButton from "@/components/ui/HapticButton";
import StarRating from "@/components/StarRating";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { getItemById } from "@/services/itemService";
import { createTransactionFromItem } from "@/services/transactionServise";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { tr } from "react-native-paper-dates";

export default function ApproveTransaction() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [item, setItem] = useState<any>(null);
  const [customerName, setCustomerName] = useState("John Doe");

  useFocusEffect(
    useCallback(() => {
      const fetchItemDetails = async () => {
        setLoading(true);
        try {
          const customerData = await AsyncStorage.getItem("Customer_Data");
          const customer = customerData ? JSON.parse(customerData) : null;
          if (customer) {
            setCustomerName(customer.name);
          }
          const response = await getItemById(id);
          if (response.success) {
            setItem(response.item);
          } else {
            Toast.show({
              type: "error",
              text1: "Item not found",
            });
            router.replace({
              pathname: "/customer",
            });
          }
        } catch (error: any) {
          Toast.show({
            type: "error",
            text1: "Item not found",
          });
          router.replace({
            pathname: "/customer",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchItemDetails();
    }, [id])
  );

  const handleApproveDeposit = async () => {
    try {
      setLoadingApprove(true);
      const response = await createTransactionFromItem(id);
      if (response) {
        setLoadingApprove(false);
        Toast.show({
          type: "success",
          text1: "Deposit approved successfully",
        });
        await router.replace({
          pathname: "/customer",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to approve deposit",
        });
        setLoadingApprove(false);
      }
    } catch (error: any) {
      console.log("Error response:", error.response.data.message);
      Toast.show({
        type: "error",
        text1: error.response.data.message,
      });
      setLoadingApprove(false);
    }
  };

  if (loading || !item) {
    return (
      <View className="flex-1 items-center justify-center bg-indigo-900">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  const businessName = item.business?.name ?? "VIP User";
  const rating = item.business?.rating ?? 0;
  const returnDate = new Date(item.return_date);
  const formattedDate = returnDate.toLocaleDateString();
  const formattedTime = returnDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <SafeAreaView className="flex-1 bg-indigo-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="px-4 pt-4 flex-row items-center">
        <HapticButton
          onPress={() => router.back()}
          className="p-2 rounded-full bg-indigo-700"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </HapticButton>
        <View className="px-6 pt-2">
          <Text className="text-white text-2xl font-semibold">
            Hello {customerName}
          </Text>
          <Text className="text-white/70 text-md">New deposit</Text>
        </View>
      </View>

      {/* Payment Card */}
      <View className="mx-6 mt-8 bg-indigo-800 rounded-3xl p-6">
        {/* User Info */}
        <View className="flex-row items-center mb-4">
          <View className="w-16 h-16 rounded-full bg-gray-300 items-center justify-center overflow-hidden">
            {item.image ? (
              <Image source={{ uri: item.image }} className="w-full h-full" />
            ) : (
              <Ionicons name="person-circle-outline" size={48} color="white" />
            )}
          </View>
          <View className="ml-3">
            <Text className="text-white/90 text-lg font-medium">
              {businessName}
            </Text>
            <StarRating rating={rating} />
          </View>
        </View>

        {/* Payment Details */}
        <View className="mb-4 mt-4">
          <Text className="text-white/70 text-lg mb-2 font-semibold text-center">
            The deposit fee is:
          </Text>
          <Text className="text-white text-3xl font-bold text-center">
            {item.price}
            {item.currency === "USD" ? "$" : item.currency}
          </Text>
        </View>

        {/* Additional Info */}
        <View className="mb-6">
          <Text className="text-white/70 text-md text-center mb-1">
            {item.description}
          </Text>
        </View>

        {/* Return Info */}
        <View className="flex-row justify-between">
          <View>
            <Text className="text-white/70 text-md">Return date</Text>
            <Text className="text-white text-md mt-1 text-center">
              {formattedDate}
            </Text>
          </View>
          <View>
            <Text className="text-white/70 text-md">Return time</Text>
            <Text className="text-white text-md mt-1 text-center">
              {formattedTime}
            </Text>
          </View>
        </View>
      </View>

      {/* Approve Button */}
      <View className="absolute bottom-10 left-0 right-0 px-6">
        <Button
          onPress={handleApproveDeposit}
          className="bg-white py-4 rounded-full items-center justify-center"
          disabled={loadingApprove}
        >
          {loadingApprove ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <Text className="text-indigo-900 font-semibold text-lg">
              Approve deposit
            </Text>
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
}