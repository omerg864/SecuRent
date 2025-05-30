import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import Header from "@/components/ui/Header";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedTextInput } from "@/components/ui/ThemedTextInput";
import ProfileImageInput from "@/components/ProfileImageInput";
import HapticButton from "@/components/ui/HapticButton";
import ShowToast from "@/components/ui/ShowToast";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Colors } from "@/constants/Colors";
import { emailRegex } from "@/utils/regex";
import { useCustomer } from "@/context/CustomerContext";
import { FileObject } from "@/types/business";
import { updateCustomerDetails } from "@/services/customerService";
import { CustomerResponse } from "@/services/interfaceService";

const UpdateCustomerScreen = () => {
  const router = useRouter();
  const { customer, setCustomer } = useCustomer();

  const [name, setName] = useState(customer?.name || "");
  const [email, setEmail] = useState(customer?.email || "");
  const [file, setFile] = useState<FileObject | null>(null);
  const [loading, setLoading] = useState(false);

  const goBack = () => router.replace({ pathname: "./settings" });

  const handleUpdate = async () => {
    if (!name || !email) {
      ShowToast("info", "Please fill in all fields");
      return;
    }
    if (!emailRegex.test(email)) {
      ShowToast("info", "Email address is invalid");
      return;
    }

    setLoading(true);
    try {
      const updatedData = { name, email };
      const response: CustomerResponse = await updateCustomerDetails(
        updatedData,
        file
      );

      if (!response.success) {
        ShowToast("error", "Failed to update profile");
        setLoading(false);
        return;
      }

      setCustomer(response.customer);
      ShowToast("success", "Profile updated successfully");
      router.replace({ pathname: "./settings" });
    } catch (error: any) {
      ShowToast(
        "error",
        error.response?.data?.message || "Error updating profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#D0D0D0" }}
      onBack={goBack}
      headerImage={
        <FontAwesome5
          name="user-edit"
          size={250}
          color="#808080"
          style={styles.headerImage}
        />
      }
    >
      <View className="flex-1 px-6 pt-6 pb-12 bg-white">
        <ThemedText className="text-2xl font-bold mb-2" darkColor="black">
          Edit your details
        </ThemedText>
        <ThemedText className="text-sm" darkColor="black">
          Update your name, email, or profile photo
        </ThemedText>

        <View className="space-y-6 mt-4">
          <View className="flex flex-col items-center justify-center">
            <ThemedText
              className="text-md -mb-6 text-black font-medium text-center"
              darkColor="black"
            >
              Profile Picture
            </ThemedText>
            <ProfileImageInput
              file={file}
              setFile={setFile}
              initialUrl={customer?.image}
            />
          </View>

          <ThemedText
            className="text-sm text-black mb-1 font-medium"
            darkColor="black"
          >
            Name
          </ThemedText>
          <ThemedTextInput
            className="w-full h-12 px-4 border border-gray-300 rounded-md"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            darkColor="black"
          />
          <ThemedText
            className="text-sm text-black mb-1 mt-2 font-medium"
            darkColor="black"
          >
            Email
          </ThemedText>
          <ThemedTextInput
            className="w-full h-12 px-4 border border-gray-300 rounded-md text-black"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            darkColor="black"
          />
        </View>

        <View className="flex-row justify-center mt-auto mb-20 items-end">
          <HapticButton
            style={{ backgroundColor: Colors.light.tintBlue }}
            className="w-40 h-16 rounded-full justify-center items-center"
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <ThemedText
                className="text-white font-semibold"
                lightColor="#fff"
              >
                Save
              </ThemedText>
            )}
          </HapticButton>
        </View>
      </View>
    </ParallaxScrollView>
  );
};

export default UpdateCustomerScreen;

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
});
