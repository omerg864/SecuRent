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
          const businessData = await AsyncStorage.getItem("Business_Data");
          const customerData = await AsyncStorage.getItem("Customer_Data");
  
          if (businessData) {
            router.replace("/business/business-home");
            return; // Stop execution to prevent further navigation
          }
  
          if (customerData) {
            router.replace("/customer");
            return; // Stop execution to prevent further navigation
          }
  
          // If no stored data, navigate to login
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
        </Stack>
        <StatusBar style={colorScheme === "dark" ? "dark" : "light"} />
      </ThemeProvider>
    </AuthProvider>
  );
}
