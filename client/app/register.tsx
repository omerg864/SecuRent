import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import HapticButton from "@/components/ui/HapticButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { ThemedTextInput } from "@/components/ui/ThemedTextInput";
import Ionicons from "@expo/vector-icons/Ionicons";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Header from "@/components/ui/Header";
import { useLocalSearchParams } from "expo-router";

const RegisterScreen = () => {
  const [name, setName] = useState("Louis04real");
  const [email, setEmail] = useState("Louis04real@gmail.com");
  const [password, setPassword] = useState("password");
  const [confirmPassword, setConfirmPassword] = useState("confirm password");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { accountType } = useLocalSearchParams();

  const goBack = () => {
    router.back();
  };

  const handleRegister = () => {
    router.dismissAll();
    router.replace({
      pathname: "./setup-screen",
      params: { accountType },
    });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      onBack={goBack}
      headerImage={
        <FontAwesome5
          name="user-plus"
          size={250}
          color="#808080"
          style={styles.headerImage}
        />
      }
    >
      <Header title="Register" />

      <View className="flex-1 px-6">
        <ThemedText className="text-2xl font-bold mb-2">
          Welcome, create your {accountType} Account
        </ThemedText>
        <ThemedText className="text-sm mb-8">
          Hey there! Let's get you started
        </ThemedText>

        <View className="space-y-6">
          <ThemedTextInput
            className="w-full h-12 px-4 border border-gray-300 rounded-md"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            label={accountType === "business" ? "Business name" : "Name"}
          />

          <ThemedTextInput
            className="w-full h-12 px-4 border border-gray-300 rounded-md"
            value={email}
            onChangeText={setEmail}
            containerClassName="mt-4"
            keyboardType="email-address"
            autoCapitalize="none"
            label="Email"
          />

          <ThemedTextInput
            className="w-full h-12 px-4 border border-gray-300 rounded-md pr-12"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            label="Password"
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
        </View>

        <View className="flex-row justify-center mt-auto mb-14 items-baseline">
          <HapticButton
            style={{ backgroundColor: Colors.light.tintBlue }}
            className={`w-40 h-16 rounded-full justify-center items-center`}
            onPress={handleRegister}
          >
            <ThemedText className="text-white font-semibold" lightColor="#fff">
              Sign up
            </ThemedText>
          </HapticButton>
        </View>
      </View>
    </ParallaxScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
});
