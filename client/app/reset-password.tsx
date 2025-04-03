import React, { useState } from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedTextInput } from "@/components/ui/ThemedTextInput";
import HapticButton from "@/components/ui/HapticButton";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import Toast from "react-native-toast-message";
import { updateBusinessPassword } from "@/services/businessService";
import { ActivityIndicator } from "react-native";
import { updateCustomerPassword } from "@/services/customerService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Toast.show({
        type: "info",
        text1: "Please fill in all fields",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "info",
        text1: "Passwords do not match",
      });
      return;
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      alert(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }
    setLoading(true);
    try {
      const type = await AsyncStorage.getItem("Type");
      if (type === "customer") {
        const response: any = await updateCustomerPassword(newPassword);
        if (!response) {
          setLoading(false);
          Toast.show({
            type: "error",
            text1: "Internal Server Error",
          });
          return;
        }
      } else {
        const response: any = await updateBusinessPassword(newPassword);
        if (!response) {
          setLoading(false);
          Toast.show({
            type: "error",
            text1: "Internal Server Error",
          });
          return;
        }
      }
      AsyncStorage.removeItem("Type");
      Toast.show({
        type: "success",
        text1: "Password reset successfully",
      });
      router.dismissAll();
      router.replace("/login");
    } catch (error: any) {
        Toast.show({
          type: "error",
          text1: error.response.data.message,
        });
        setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      onBack={() => router.back()}
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
            className="w-full h-12 px-4 border border-gray-300 rounded-md pr-12"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showPassword}
            label="New Password"
            containerClassName="mt-4"
            Icon={
              showPassword ? (
                <Ionicons
                  name="eye-off"
                  className="absolute right-0 top-3 bottom-0 justify-center px-3"
                  size={24}
                  color={Colors.light.tint}
                />
              ) : (
                <Ionicons
                  name="eye"
                  className="absolute right-0 top-3 bottom-0 justify-center px-3"
                  size={24}
                  color={Colors.light.tint}
                />
              )
            }
            onIconPress={() => setShowPassword(!showPassword)}
          />

          <ThemedTextInput
            className="w-full h-12 px-4 border border-gray-300 rounded-md pr-12"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            label="Confirm Password"
            containerClassName="mt-4 mb-4"
            Icon={
              showConfirmPassword ? (
                <Ionicons
                  name="eye-off"
                  className="absolute right-0 top-3 bottom-0 justify-center px-3"
                  size={24}
                  color={Colors.light.tint}
                />
              ) : (
                <Ionicons
                  name="eye"
                  className="absolute right-0 top-3 bottom-0 justify-center px-3"
                  size={24}
                  color={Colors.light.tint}
                />
              )
            }
            onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
          <HapticButton
            onPress={handleResetPassword}
            className="bg-indigo-600/30 py-3 mt-2 rounded-xl"
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <ThemedText className="text-white text-center text-lg font-semibold">
                Reset Password
              </ThemedText>
            )}
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
