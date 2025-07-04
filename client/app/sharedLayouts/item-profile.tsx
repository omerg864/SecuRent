import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  Text,
  Alert,
} from "react-native";
import {
  useRouter,
  useLocalSearchParams,
  RelativePathString,
} from "expo-router";
import HapticButton from "@/components/ui/HapticButton";
import {
  deleteItemById,
  getItemById,
  getItemByIdForBusiness,
} from "@/services/itemService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import { formatCurrencySymbol } from "@/utils/functions";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ShowToast from "@/components/ui/ShowToast";
import { CURRENT_ACCOUNT_TYPE } from "@/utils/asyncStorageConstants";
import { USER_ID } from "@/utils/asyncStorageConstants";

const ItemProfileScreen = () => {
  const { id, from } = useLocalSearchParams<{ id: string; from: string }>();
  const router = useRouter();

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<"delete" | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const type = await AsyncStorage.getItem(CURRENT_ACCOUNT_TYPE);
        setAccountType(type);
        const storedUserId = (await AsyncStorage.getItem(USER_ID)) || "";
        console.log("Stored User ID:", storedUserId);
        console.log("Type:", type);
        const data =
          type === "business"
            ? await getItemByIdForBusiness(id)
            : await getItemById(id, storedUserId);

        setItem(data.item);
      } catch (error) {
        ShowToast("error", "Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, from]);

  const handlePress = () => {
    router.push({
      pathname: "/customer/approve-transaction",
      params: { id },
    } as const);
  };

  const handleDelete = () => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoadingAction("delete");
          try {
            await deleteItemById(id);
            ShowToast("success", "Item deleted successfully");
            router.replace("/business/business-home");
          } catch (error: any) {
            ShowToast("error", error.response?.data.message || "Delete failed");
          } finally {
            setLoadingAction(null);
          }
        },
      },
    ]);
  };

  if (loading) return <LoadingSpinner label="Loading item profile..." />;

  if (!item) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-black">Item not found</Text>
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerImage={
        item.image ? (
          <Image
            source={{ uri: item.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full justify-center items-center bg-gray-400">
            <Ionicons name="image-outline" size={130} color="white" />
            <Text className="text-white text-lg font-bold">
              No image available
            </Text>
          </View>
        )
      }
      headerBackgroundColor={{ light: "#ffffff", dark: "#ffffff" }}
      onBack={() =>
        router.replace({
          pathname: from as RelativePathString,
        })
      }
    >
      <ScrollView className="bg-white px-4 pb-8">
        {/* Description */}
        <Text className="text-2xl font-bold text-black mb-6 mt-6">
          {item.description}
        </Text>

        {/* Item Details Block */}
        <View
          className={`bg-gray-100 rounded-2xl p-5 space-y-6 ${
            item.smartPrice ? "mb-2" : "mb-10"
          } mt4`}
        >
          {/* Rental Duration */}
          <View className="flex-row items-center justify-between mb-2 mt-2">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={22} color="#666" />
              <Text className="ml-2 text-base text-gray-500">
                Rental Duration
              </Text>
            </View>
            <Text className="text-xl font-bold text-black">
              {item.duration ? `${item.duration} ${item.timeUnit}` : "N/A"}
            </Text>
          </View>

          {/* Divider */}
          <View className="h-px bg-gray-300 my-2" />

          {/* Deposit Price */}
          <View className="flex-row items-center justify-between mb-2 mt-2">
            <View className="flex-row items-center">
              <Ionicons name="cash-outline" size={22} color="#666" />
              <Text className="ml-2 text-base text-gray-500">
                Deposit Price{" "}
                {item.smartPrice && <Text className="text-red-600">*</Text>}
              </Text>
            </View>
            <Text
              className={`text-xl font-bold ${
                item.smartPrice ? "text-red-600" : "text-black"
              }`}
            >
              {item.price} {formatCurrencySymbol(item.currency)}
            </Text>
          </View>
        </View>

        {item.smartPrice && (
          <Text className="text-xs text-red-600 mb-10">
            * This is the minimum deposit price. The actual price will be
            adjusted based on client risk and shown before approval.
          </Text>
        )}

        {/* Action Button */}
        {accountType === "personal" && (
          <HapticButton
            onPress={() =>
              router.push({
                pathname: "/customer/approve-transaction",
                params: { id },
              } as const)
            }
            className="w-full h-16 bg-indigo-600 rounded-full justify-center items-center shadow-lg"
          >
            <Text className="text-white text-lg font-bold">
              Start your secuRent
            </Text>
          </HapticButton>
        )}

        {/*delete button */}
        {accountType === "business" && (
          <HapticButton
            onPress={handleDelete}
            disabled={loadingAction === "delete"}
            className="w-full h-16 bg-red-600 rounded-full justify-center items-center shadow-lg"
          >
            {loadingAction === "delete" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-bold">Delete item</Text>
            )}
          </HapticButton>
        )}
      </ScrollView>
    </ParallaxScrollView>
  );
};

export default ItemProfileScreen;
