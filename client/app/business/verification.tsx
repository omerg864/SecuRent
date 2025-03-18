import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedTextInput } from "@/components/ui/ThemedTextInput";
import HapticButton from "@/components/ui/HapticButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function VerifyBusinessNumberScreen() {
  const router = useRouter();
  const [businessNumber, setBusinessNumber] = useState("");

  const handleVerify = () => {
    // Add verification logic (e.g., API call) here
    if (/^\d{9}$/.test(businessNumber.trim())) {
      router.push("/business/buisness-setup"); // Redirect after verification
    } else {
      alert("Please enter a valid 9-digit business number.");
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      onBack={() => router.back()}
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
            placeholder="Enter business number"
            keyboardType="numeric"
            value={businessNumber}
            onChangeText={setBusinessNumber}
            containerClassName="border border-white p-3 rounded-xl"
            style={{ color: "white", fontSize: 18, textAlign: "center", textAlignVertical: "center" }} // Centers text and cursor
          />

          <HapticButton
            onPress={handleVerify}
            className="bg-indigo-500 py-3 mt-2 rounded-xl"
          >
            <ThemedText className="text-white text-center text-lg font-semibold">
              Verify Business Number
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
