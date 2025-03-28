"use client";

import { useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedTextInput } from "@/components/ui/ThemedTextInput";
import { ThemedText } from "@/components/ui/ThemedText";
import HapticButton from "@/components/ui/HapticButton";
import { Ionicons } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateCreditCard } from "@/services/customerService";
import { CreditCardData } from "@/services/interfaceService";
import Toast from "react-native-toast-message";

const AddPaymentScreen = () => {
  const router = useRouter();
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useLocalSearchParams();
  const accountType = (params.accountType as string) || "personal";

  const handleSavePayment = async () => {
    if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
      Toast.show({
        type: "info",
        text1: "Please fill in all fields",
      });
      return;
    }

    setLoading(true);
    try {
      const data: CreditCardData = {
        cardHolderName: cardholderName,
        number: cardNumber,
        expiry: expiryDate,
        cvv,
      };

      const response: any = await updateCreditCard(data);
      if (!response.data.success) {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Internal Server Error",
        });
        return;
      }

      const storageKey = `completedSteps_${accountType}`;
      const savedSteps = await AsyncStorage.getItem(storageKey);
      const completedSteps = savedSteps ? JSON.parse(savedSteps) : [];

      if (!completedSteps.includes("payment")) {
        completedSteps.push("payment");
        await AsyncStorage.setItem(storageKey, JSON.stringify(completedSteps));
      }
      await AsyncStorage.setItem("current_account_type", accountType);

      router.replace({
        pathname: "/setup-screen",
        params: {
          accountType: accountType,
        },
      });
    } catch (error: any) {
      if (error.response?.status == 401) {
        Toast.show({
          type: "error",
          text1: "Invalid payment details",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      onBack={() => router.back()}
      headerImage={
        <Ionicons
          name="card-outline"
          size={250}
          color="#808080"
          style={{ position: "absolute", bottom: -90, left: -35 }}
        />
      }
    >
      <ScrollView className="pb-8">
        <View className="px-5 pt-8 pb-5">
          <ThemedText className="text-3xl font-bold text-white">
            Add Payment Method
          </ThemedText>
          <ThemedText className="text-lg text-indigo-200 mt-1">
            Enter your payment details
          </ThemedText>

          <View className="mt-5">
            <ThemedTextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-white mb-4"
              value={cardholderName}
              onChangeText={setCardholderName}
              label="Cardholder Name"
              editable={!loading}
            />

            <ThemedTextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-white mb-4"
              value={cardNumber}
              onChangeText={setCardNumber}
              label="Card Number"
              keyboardType="numeric"
              editable={!loading}
            />

            <ThemedTextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-white mb-4"
              value={expiryDate}
              onChangeText={(text) => {
                let formattedText = text.replace(/\D/g, ""); // Remove non-numeric characters
                if (formattedText.length > 2) {
                  formattedText = `${formattedText.slice(
                    0,
                    2
                  )}/${formattedText.slice(2, 4)}`;
                }
                setExpiryDate(formattedText);
              }}
              label="Expiry Date (MM/YY)"
              keyboardType="numeric"
              editable={!loading}
            />

            <ThemedTextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-white mb-4"
              value={cvv}
              onChangeText={setCvv}
              label="CVV"
              keyboardType="numeric"
              editable={!loading}
            />
          </View>

          {/* Save Button */}
          <View className="flex-row justify-center mt-4">
            <HapticButton
              onPress={handleSavePayment}
              className="bg-indigo-600/30 py-3 px-8 rounded-xl w-full"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <ThemedText className="text-white text-center text-lg font-semibold">
                  Save Payment Method
                </ThemedText>
              )}
            </HapticButton>
          </View>
        </View>
      </ScrollView>
    </ParallaxScrollView>
  );
};

export default AddPaymentScreen;
