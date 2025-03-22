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

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const params = useLocalSearchParams();
  // Get account type from params, use the correct account type based on context
  const accountType = (params.accountType as string) || "business";

  const handleVerify = async () => {
    // Add verification logic (e.g., API call) here
    if (code.trim().length === 6) {
      try {
        // Mark this step as completed for the specific account type
        const storageKey = `completedSteps_${accountType}`;

        // Get existing completed steps
        const savedSteps = await AsyncStorage.getItem(storageKey);
        const completedSteps = savedSteps ? JSON.parse(savedSteps) : [];

        // Check if this step is already completed
        if (!completedSteps.includes("email")) {
          // Add this step to the completed steps
          completedSteps.push("email");

          // Save the updated completed steps
          await AsyncStorage.setItem(
            storageKey,
            JSON.stringify(completedSteps)
          );

          // For debugging
          console.log(
            `Email verification completed. Completed steps for ${accountType}:`,
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
            verifiedEmail: "true",
          },
        });
      } catch (error) {
        console.error("Error verifying email:", error);
        alert("There was an error verifying your email. Please try again.");
      }
    } else {
      alert("Please enter a valid 6-digit code.");
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <MaterialCommunityIcons
          name="email-check-outline"
          size={250}
          color="#808080"
          style={styles.headerImage}
        />
      }
    >
      <View className="px-6 pt-8">
        <ThemedText className="text-3xl font-bold text-white">
          Verify Your Email
        </ThemedText>
        <ThemedText className="text-lg text-indigo-200 mt-1">
          Enter the verification code sent to your email
        </ThemedText>

        <View className="space-y-4 mt-8 flex-col gap-4">
          <ThemedTextInput
            placeholder="Enter verification code"
            keyboardType="numeric"
            value={code}
            onChangeText={setCode}
            containerClassName="border border-white p-3 rounded-xl"
            style={{
              color: "white",
              fontSize: 18,
              textAlign: "center",
              textAlignVertical: "center",
            }} // Centers text and cursor
          />

          <HapticButton
            onPress={handleVerify}
            className="bg-indigo-600/30 py-3 mt-2 rounded-xl"
          >
            <ThemedText className="text-white text-center text-lg font-semibold">
              Verify Email
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
