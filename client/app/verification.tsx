"use client";

import { useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedTextInput } from "@/components/ui/ThemedTextInput";
import HapticButton from "@/components/ui/HapticButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { verifyCompanyNumber } from "@/services/businessService";
import { AuthResponse } from "@/services/interfaceService";

export default function VerifyBusinessNumberScreen() {
  const router = useRouter();
  const [businessNumber, setBusinessNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useLocalSearchParams();
  const accountType = (params.accountType as string) || "business";

  const handleVerify = async () => {
    if (/^\d{9}$/.test(businessNumber.trim())) {
      setLoading(true); // Show loader
      try {
        const response: any = await verifyCompanyNumber(businessNumber);
        console.log(response.data);

        if (!response.data.success) {
          console.log("Verification failed");
          return;
        }

        const storageKey = `completedSteps_${accountType}`;
        const savedSteps = await AsyncStorage.getItem(storageKey);
        const completedSteps = savedSteps ? JSON.parse(savedSteps) : [];

        if (!completedSteps.includes("verification")) {
          completedSteps.push("verification");
          await AsyncStorage.setItem(
            storageKey,
            JSON.stringify(completedSteps)
          );
        }

        await AsyncStorage.setItem("current_account_type", accountType);

        router.replace({
          pathname: "./setup-screen",
          params: {
            accountType: accountType,
            verifiedBusiness: "true",
          },
        });
      } catch (error: any) {
        console.log(error);
        if (error.response?.status == 401) {
          alert("Business number is taken by another business");
        }
        if (error.response?.status == 402) {
          alert("Business number is invalid");
        }
      } finally {
        setLoading(false); // Hide loader
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
            keyboardType="numeric"
            value={businessNumber}
            onChangeText={setBusinessNumber}
            className="w-full h-12 px-4 border border-gray-300 rounded-md"
            label="Business Number"
            editable={!loading} // Disable input while loading
          />

          <HapticButton
            onPress={handleVerify}
            className="bg-indigo-600/30 py-3 mt-2 rounded-xl"
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <ThemedText className="text-white text-center text-lg font-semibold">
                Verify Business Number
              </ThemedText>
            )}
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
