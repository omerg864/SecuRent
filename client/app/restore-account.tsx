import React, { useState } from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedTextInput } from "@/components/ui/ThemedTextInput";
import HapticButton from "@/components/ui/HapticButton";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

const RestoreAccountScreen = () => {
  const [email, setEmail] = useState("");

  const handleRestore = () => {
    if (!email) {
      alert("Please fill in all fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    router.replace("/verify-email");
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <MaterialCommunityIcons
          name="email-outline"
          size={250}
          color="#808080"
          style={styles.headerImage}
        />
      }
    >
      <View className="px-6 pt-8">
        <ThemedText className="text-3xl font-bold text-white">
          Restore Your Account
        </ThemedText>
        <ThemedText className="text-lg text-indigo-200 mt-1">
          Enter your email
        </ThemedText>

        <View className="space-y-4 mt-8 flex-col gap-4">
          <ThemedTextInput
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            containerClassName="border border-white p-3 rounded-xl"
            style={{
              color: "white",
              fontSize: 18,
              textAlign: "center",
              textAlignVertical: "center",
            }}
          />

          <HapticButton
            onPress={handleRestore}
            className="bg-indigo-600/30 py-3 mt-2 rounded-xl"
          >
            <ThemedText className="text-white text-center text-lg font-semibold">
                Restore Account
            </ThemedText>
          </HapticButton>
        </View>
      </View>
    </ParallaxScrollView>
  );
};

export default RestoreAccountScreen;

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
});
