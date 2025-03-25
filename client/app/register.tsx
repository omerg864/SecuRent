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
import AntDesign from "@expo/vector-icons/AntDesign";
import Header from "@/components/ui/Header";
import { useLocalSearchParams } from "expo-router";
import { registerBusiness, loginBusiness } from "@/services/businessService";
import { registerCustomer, loginCustomer } from "@/services/customerService";
import { AuthData } from "@/services/interfaceService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { accountType } = useLocalSearchParams();

  const goBack = () => {
    router.back();
  };

  const handleGoogleLogin = async () => {
    alert("Google login not implemented yet.");
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    //Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }
    try {
      const Data: AuthData = {
        name,
        email,
        password,
      };
      if (accountType === "business") {
        const response = await registerBusiness(Data);
        if (!response) {
          return;
        }
        const loginResponse = await loginBusiness({ email, password });
        if (!loginResponse.success) {
          return;
        }
        console.log("Business login response:", loginResponse);
        AsyncStorage.setItem("Access_Token", loginResponse.accessToken);
        AsyncStorage.setItem("Refresh_Token", loginResponse.refreshToken);
        AsyncStorage.setItem("Business_Data", JSON.stringify(loginResponse.business));

      } else {
        const response = await registerCustomer(Data);
        if (!response) {
          return;
        }
        const loginResponse = await loginCustomer({ email, password });
        if (!loginResponse.success) {
          return;
        }
        console.log("Customer login response:", loginResponse);
        AsyncStorage.setItem("Access_Token", loginResponse.accessToken);
        AsyncStorage.setItem("Refresh_Token", loginResponse.refreshToken);
        AsyncStorage.setItem("Customer_Data", JSON.stringify(loginResponse.customer));
      }
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 23);
      AsyncStorage.setItem("Auth_Expiration", expiration.toISOString());
      AsyncStorage.setItem("Account_setup", "true");
      router.dismissAll();
      router.replace({
        pathname: "./setup-screen",
        params: { accountType },
      });
    } catch (error: any) {
      if (error.response?.status === 409 || error.response?.status === 403) {
        alert("An account with that email already exists.");
        return;
      }
      alert(error || "Registration failed.");
    }
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

         {/* Optional divider */}
         <View className="flex-row items-center my-4">
          <View className="flex-1 h-px bg-gray-300" />
          <ThemedText className="mx-4 text-sm text-gray-500">or</ThemedText>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Google Login Button */}
        <View className="mt-2 mb-2">
          <HapticButton
            className="w-full h-12 border border-gray-300 rounded-full flex-row justify-center items-center bg-white"
            onPress={handleGoogleLogin}
          >
            <AntDesign
              name="google"
              size={20}
              color= "#000"
              style={{ marginRight: 10 }}
            />
            <ThemedText
              className="font-semibold"
              darkColor="#000"
              lightColor="#000"
            >
              Register with Google
            </ThemedText>
          </HapticButton>
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
