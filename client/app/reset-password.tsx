import React, { useState } from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedTextInput } from "@/components/ui/ThemedTextInput";
import HapticButton from "@/components/ui/HapticButton";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    router.dismissAll();
    router.replace("/login");
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <MaterialCommunityIcons
          name="lock-reset"
          size={250}
          color="#808080"
          style={styles.headerImage}
        />
      }
    >
      <View className="px-6 pt-8">
        <ThemedText className="text-3xl font-bold text-white">
          Reset Your Password
        </ThemedText>
        <ThemedText className="text-lg text-indigo-200 mt-1">
          Enter a new password below
        </ThemedText>

        <View className="space-y-4 mt-8 flex-col gap-4">
          <ThemedTextInput
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            containerClassName="border border-white p-3 rounded-xl"
            style={{
              color: "white",
              fontSize: 18,
              textAlign: "center",
              textAlignVertical: "center",
            }}
          />

          <ThemedTextInput
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            containerClassName="border border-white p-3 rounded-xl"
            style={{
              color: "white",
              fontSize: 18,
              textAlign: "center",
              textAlignVertical: "center",
            }}
          />

          <HapticButton
            onPress={handleResetPassword}
            className="bg-indigo-600/30 py-3 mt-2 rounded-xl"
          >
            <ThemedText className="text-white text-center text-lg font-semibold">
              Reset Password
            </ThemedText>
          </HapticButton>
        </View>
      </View>
    </ParallaxScrollView>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
});
