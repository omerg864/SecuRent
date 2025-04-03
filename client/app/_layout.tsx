import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../global.css";
import Toast from "react-native-toast-message";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      const checkStorage = async () => {
        try {
          // await AsyncStorage.multiRemove([
          //   "Business_Data",
          //   "Customer_Data",
          //   "Account_setup",
          //   "current_account_type",
          //   "completedSteps_business",
          //   "completedSteps_personal",
          //   "Access_Token",
          //   "Refresh_Token",
          //   "Auth_Expiration",
          //   "Account_setup",
          // ]);
          const businessData = await AsyncStorage.getItem("Business_Data");
          const customerData = await AsyncStorage.getItem("Customer_Data");

          if (businessData) {
            const setup_mode = await AsyncStorage.getItem("Account_setup");
            if (setup_mode === "true") {
              router.replace("/login");
              return;
            }
            router.replace("/business/business-home");
            return;
          }

          if (customerData) {
            const setup_mode = await AsyncStorage.getItem("Account_setup");
            if (setup_mode === "true") {
              router.replace("/login");
              return;
            }

            router.replace("/customer");
            return;
          }
          router.replace("/login");
        } catch (error) {
          console.error("Error reading AsyncStorage:", error);
        } finally {
          SplashScreen.hideAsync();
        }
      };

      checkStorage();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false, // Hide headers globally
          }}
        >
          <Stack.Screen name="customer" />
          <Stack.Screen name="business" />
          <Stack.Screen name="login" />
          <Stack.Screen name="get-started" />
          <Stack.Screen name="register" />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="bank-details" />
          <Stack.Screen name="setup-screen" />
          <Stack.Screen name="verification" />
          <Stack.Screen name="verify-email" />
          <Stack.Screen name="add-payment" />
          <Stack.Screen name="reset-password" />
          <Stack.Screen name="restore-account" />
        </Stack>
        <StatusBar style={colorScheme === "dark" ? "dark" : "light"} />
        <Toast />
      </ThemeProvider>
    </AuthProvider>
  );
}
