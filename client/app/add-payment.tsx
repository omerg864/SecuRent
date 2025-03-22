"use client";

import { useState } from "react";
import { View, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedTextInput } from "@/components/ui/ThemedTextInput";
import { ThemedText } from "@/components/ui/ThemedText";
import HapticButton from "@/components/ui/HapticButton";
import { Ionicons } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddPaymentScreen = () => {
  const router = useRouter();
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const params = useLocalSearchParams();
  // Get account type from params, default to "personal" for this screen
  const accountType = (params.accountType as string) || "personal";

  const handleSavePayment = async () => {
    try {
      // Mark this step as completed for the specific account type
      const storageKey = `completedSteps_${accountType}`;
      const savedSteps = await AsyncStorage.getItem(storageKey);
      const completedSteps = savedSteps ? JSON.parse(savedSteps) : [];

      if (!completedSteps.includes("payment")) {
        completedSteps.push("payment");
        await AsyncStorage.setItem(storageKey, JSON.stringify(completedSteps));
      }

      // Save the current account type for persistence
      await AsyncStorage.setItem("current_account_type", accountType);

      // Navigate back to setup screen with both account type and completion status
      router.replace({
        pathname: "/setup-screen",
        params: {
          accountType: accountType,
          addedPayment: "true",
        },
      });
    } catch (error) {
      console.error("Error saving payment method:", error);
      alert("There was an error saving your payment method. Please try again.");
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
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
            />

            <ThemedTextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-white mb-4"
              value={cardNumber}
              onChangeText={setCardNumber}
              label="Card Number"
              keyboardType="numeric"
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
            />

            <ThemedTextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-white mb-4"
              value={cvv}
              onChangeText={setCvv}
              label="CVV"
              keyboardType="numeric"
            />
          </View>

          {/* Save Button */}
          <View className="flex-row justify-center mt-4">
            <HapticButton
              onPress={handleSavePayment}
              className="bg-indigo-600/30 py-3 px-8 rounded-xl w-full"
            >
              <ThemedText className="text-white text-center text-lg font-semibold">
                Save Payment Method
              </ThemedText>
            </HapticButton>
          </View>
        </View>
      </ScrollView>
    </ParallaxScrollView>
  );
};

export default AddPaymentScreen;
