import React from "react";
import { View, StyleSheet } from "react-native";
import HapticButton from "@/components/ui/HapticButton"; 
import { ThemedText } from "@/components/ui/ThemedText"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const LogoutScreen = () => {

const handleLogout = async () => {
    try {
        await AsyncStorage.removeItem("Customer_Data");
        await AsyncStorage.removeItem("Access_Token");
        await AsyncStorage.removeItem("Refresh_Token");
        await AsyncStorage.removeItem("Auth_Expiration");

        router.replace("/login"); 
    } catch (error) {
        console.error("Error during logout:", error);
    }
}

  return (
    <View style={styles.container}>
      <HapticButton
        className="bg-white py-6 px-6 rounded-full"
        style={{ backgroundColor: "red" }}
        onPress={handleLogout}
      >
        <ThemedText
          className="text-black font-semibold text-lg"
          style={{ color: "white" }}
        >
          Logout
        </ThemedText>
      </HapticButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default LogoutScreen;
