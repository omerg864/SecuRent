"use client";

import { useState } from "react";
import {
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedTextInput } from "@/components/ui/ThemedTextInput";
import { ThemedText } from "@/components/ui/ThemedText";
import HapticButton from "@/components/ui/HapticButton";
import { Ionicons } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BankDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  // Get account type from params, default to "business" for this screen
  const accountType = (params.accountType as string) || "business";

  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchNumber, setBranchNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const banks = [
    { label: "Bank Hapoalim", value: "bank_hapoalim" },
    { label: "Leumi Bank", value: "leumi_bank" },
    { label: "Mizrahi Tefahot Bank", value: "mizrahi_tefahot" },
    { label: "Discount Bank", value: "discount_bank" },
    {
      label: "First International Bank of Israel",
      value: "first_international_bank",
    },
    { label: "Bank of Jerusalem and the Middle East", value: "bank_jerusalem" },
    { label: "Bank Otzar HaHayal", value: "bank_otzar_hahyal" },
    { label: "Union Bank", value: "union_bank" },
    { label: "Bank Yahav", value: "bank_yahav" },
    { label: "Bank Massad", value: "bank_massad" },
  ];

  const handleSaveDetails = async () => {
    try {
      // Validate form fields
      if (!accountHolderName || !bankName || !branchNumber || !accountNumber) {
        alert("Please fill in all fields");
        return;
      }

      // Mark this step as completed for the specific account type
      const storageKey = `completedSteps_${accountType}`;

      // Get existing completed steps
      const savedSteps = await AsyncStorage.getItem(storageKey);
      const completedSteps = savedSteps ? JSON.parse(savedSteps) : [];

      // Check if this step is already completed
      if (!completedSteps.includes("bank")) {
        // Add this step to the completed steps
        completedSteps.push("bank");

        // Save the updated completed steps
        await AsyncStorage.setItem(storageKey, JSON.stringify(completedSteps));

        // For debugging
        console.log(
          `Bank details saved. Completed steps for ${accountType}:`,
          completedSteps
        );
      }

      // Save the current account type for persistence
      await AsyncStorage.setItem("current_account_type", accountType);

      // Navigate back to setup screen with both account type and completion status
      router.replace({
        pathname: "./setup-screen",
        params: {
          accountType: accountType,
          addedBank: "true",
        },
      });
    } catch (error) {
      console.error("Error saving bank details:", error);
      alert("There was an error saving your bank details. Please try again.");
    }
  };

  const renderBankItem = ({
    item,
  }: {
    item: { label: string; value: string };
  }) => (
    <TouchableOpacity
      style={{
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#D0D0D0",
      }}
      onPress={() => {
        setBankName(item.label);
        setModalVisible(false);
      }}
    >
      <ThemedText style={{ fontSize: 16, color: "#333" }}>
        {item.label}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons
          name="cash-outline"
          size={250}
          color="#808080"
          style={{
            color: "#808080",
            position: "absolute",
            bottom: -90,
            left: -35,
          }}
        />
      }
    >
      <ScrollView className="pb-8">
        <View className="px-5 pt-8 pb-5">
          <ThemedText className="text-3xl font-bold text-white">
            Bank Details
          </ThemedText>
          <ThemedText className="text-lg text-indigo-200 mt-1">
            Enter your bank details to complete the setup
          </ThemedText>

          <View className="mt-5">
            {/* Account Holder Name */}
            <ThemedTextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-white mb-4"
              value={accountHolderName}
              onChangeText={setAccountHolderName}
              label="Account Holder Name"
            />

            {/* Bank Name Dropdown */}
            <View className="mb-4">
              <ThemedText className="text-white text-lg">Bank Name</ThemedText>
              <TouchableOpacity
                className="h-12 w-full border border-gray-300 rounded-xl justify-center items-center"
                onPress={() => setModalVisible(true)}
              >
                <ThemedText className="text-lg text-gray-900">
                  {bankName || "Select Bank"}
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Branch Number */}
            <ThemedTextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-white mb-4"
              value={branchNumber}
              onChangeText={setBranchNumber}
              label="Branch Number"
              keyboardType="numeric"
            />

            {/* Account Number */}
            <ThemedTextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-white mb-4"
              value={accountNumber}
              onChangeText={setAccountNumber}
              label="Account Number"
              keyboardType="numeric"
            />
          </View>

          {/* Save Button */}
          <View className="flex-row justify-center mt-4">
            <HapticButton
              onPress={handleSaveDetails}
              className="bg-indigo-600/30 py-3 px-8 rounded-xl w-full"
            >
              <ThemedText className="text-white text-center text-lg font-semibold">
                Save Details
              </ThemedText>
            </HapticButton>
          </View>
        </View>
      </ScrollView>

      {/* Modal for Dropdown */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="w-4/5 bg-white rounded-xl p-5">
            <FlatList
              data={banks}
              renderItem={renderBankItem}
              keyExtractor={(item) => item.value}
            />
            <TouchableOpacity
              className="mt-5 bg-black p-3 rounded-xl items-center"
              onPress={() => setModalVisible(false)}
            >
              <ThemedText className="text-lg text-gray-700">Close</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
};

export default BankDetailsScreen;
