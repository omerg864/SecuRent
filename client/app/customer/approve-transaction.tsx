import { View, Text, Image, StatusBar, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/HapticButton";
import { router } from "expo-router";

export default function ApproveTransaction() {
  const handleApproveDeposit = () => {
    console.log("Deposit approved");
    // Add your deposit approval logic here
  };

  return (
    <SafeAreaView className="flex-1 bg-indigo-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="px-4 pt-4 flex-row items-center">
        <Button
          onPress={() => router.back()}
          className="p-2 border rounded-full bg-indigo-800 border-white"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </Button>
        <View className="px-6 pt-2">
          <Text className="text-white text-2xl font-semibold">Hello John</Text>
          <Text className="text-white/70 text-md">New deposit</Text>
        </View>
      </View>

      {/* Payment Card */}
      <View className="mx-6 mt-8 bg-indigo-800 rounded-3xl p-6">
        {/* User Info */}
        <View className="flex-row items-center mb-4">
          <Image
            source={{ uri: "https://v0.dev/placeholder.svg" }}
            className="w-16 h-16 rounded-full bg-gray-300"
          />
          <View className="ml-3">
            <Text className="text-white/90 text-lg font-medium">VIP User</Text>
            <View className="flex-row mt-1">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <Ionicons
                  key={index}
                  name="star"
                  size={24}
                  color="#FFD700"
                  className="mr-1"
                />
              ))}
            </View>
          </View>
        </View>

        {/* Payment Details */}
        <View className="mb-4 mt-4">
          //center the text
          <Text className="text-white/70 text-lg mb-2 font-semibold text-center">
            The deposit fee is:
          </Text>
          <Text className="text-white text-3xl font-bold text-center">
            600$
          </Text>
        </View>

        {/* Additional Info */}
        <View className="mb-6">
          <Text className="text-white/70 text-md text-center mb-1">
            Rental fees (Bus 1M + Internet)
          </Text>
        </View>

        {/* Return Info */}
        <View className="flex-row justify-between">
          <View>
            <Text className="text-white/70 text-md">Return date</Text>
            <Text className="text-white text-md mt-1 text-center">
              29/12/24
            </Text>
          </View>
          <View>
            <Text className="text-white/70 text-md">Return time</Text>
            <Text className="text-white text-md mt-1 text-center">14:00</Text>
          </View>
        </View>
      </View>

      {/* Approve Button */}
      <View className="absolute bottom-10 left-0 right-0 px-6">
        <Button
          onPress={handleApproveDeposit}
          className="bg-white py-4 rounded-full items-center justify-center"
        >
          <Text className="text-indigo-900 font-semibold text-lg">
            Approve deposit
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
