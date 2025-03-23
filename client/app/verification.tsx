"use client";

import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedTextInput } from "@/components/ui/ThemedTextInput";
import HapticButton from "@/components/ui/HapticButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function VerifyBusinessNumberScreen() {
  const router = useRouter();
  const [businessNumber, setBusinessNumber] = useState("");
  const params = useLocalSearchParams();
  // Get account type from params, default to "business" for this screen
  const accountType = (params.accountType as string) || "business";

  const handleVerify = async () => {
    // Add verification logic (e.g., API call) here
    if (/^\d{9}$/.test(businessNumber.trim())) {
      try {
        // Mark this step as completed for the specific account type
        const storageKey = `completedSteps_${accountType}`;

        // Get existing completed steps
        const savedSteps = await AsyncStorage.getItem(storageKey);
        const completedSteps = savedSteps ? JSON.parse(savedSteps) : [];

        // Check if this step is already completed
        if (!completedSteps.includes("verification")) {
          // Add this step to the completed steps
          completedSteps.push("verification");

          // Save the updated completed steps
          await AsyncStorage.setItem(
            storageKey,
            JSON.stringify(completedSteps)
          );

          // For debugging
          console.log(
            `Business verification completed. Completed steps for ${accountType}:`,
            completedSteps
          );
        }

        // Save the current account type for persistence
        await AsyncStorage.setItem("current_account_type", accountType);

        // Navigate back to setup screen with both account type and completion status
        router.replace({
          pathname: "/setup-screen",
          params: {
            accountType: accountType,
            verifiedBusiness: "true",
          },
        });
      } catch (error) {
        console.error("Error completing verification:", error);
        alert("There was an error completing verification. Please try again.");
      }
    } else {
      alert("Please enter a valid 9-digit business number.");
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <MaterialCommunityIcons
          name="check-outline"
          size={250}
          color="#808080"
          style={styles.headerImage}
        />
      }
    >
      <View className="px-6 pt-8">
        <ThemedText className="text-3xl font-bold text-white">
          Verify Business Number
        </ThemedText>
        <ThemedText className="text-lg text-indigo-200 mt-1">
          Enter your 9-digit registered business number
        </ThemedText>

        <View className="space-y-4 mt-8 flex-col gap-4">
          <ThemedTextInput
            placeholder="Enter business number"
            keyboardType="numeric"
            value={businessNumber}
            onChangeText={setBusinessNumber}
            containerClassName="border border-white p-3 rounded-xl"
            style={{
              color: "white",
              fontSize: 18,
              textAlign: "center",
              textAlignVertical: "center",
            }}
          />

          <HapticButton
            onPress={handleVerify}
            className="bg-indigo-600/30 py-3 mt-2 rounded-xl"
          >
            <ThemedText className="text-white text-center text-lg font-semibold">
              Verify Business Number
            </ThemedText>
          </HapticButton>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
});
