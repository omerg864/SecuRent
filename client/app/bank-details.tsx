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
import Toast from "react-native-toast-message";
import { ActivityIndicator } from "react-native";
import { updateBankDetails } from "@/services/businessService";
import { BankDetails } from "@/services/interfaceService";

const BankDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const accountType = (params.accountType as string) || "business";
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchNumber, setBranchNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
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
    if (!accountHolderName || !bankName || !branchNumber || !accountNumber) {
      Toast.show({
        type: "info",
        text1: "Please fill in all fields",
      });
      return;
    }
    if (branchNumber.length !== 3) {
      Toast.show({
        type: "info",
        text1: "Branch number must be 3 digits",
      });
      return;
    }
    if (accountNumber.length !== 6) {
      Toast.show({
        type: "info",
        text1: "Account number must be 6 digits",
      });
      return;
    }
    setLoading(true);
    try {
      const data: BankDetails = {
        accountHolderName,
        bankName,
        sortCode: branchNumber,
        accountNumber,
      };
      const response: any = await updateBankDetails(data);
      console.log(response);
      if (!response) {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Internal Server Error",
        });
        return;
      }
      const storageKey = `completedSteps_${accountType}`;
      const savedSteps = await AsyncStorage.getItem(storageKey);
      const completedSteps = savedSteps ? JSON.parse(savedSteps) : [];
      if (!completedSteps.includes("bank")) {
        completedSteps.push("bank");
        await AsyncStorage.setItem(storageKey, JSON.stringify(completedSteps));
      }
      await AsyncStorage.setItem("current_account_type", accountType);
      Toast.show({
        type: "success",
        text1: "Bank details saved successfully",
      });
      router.replace({
        pathname: "./setup-screen",
        params: {
          accountType: accountType,
        },
      });
    } catch (error: any) {
      if (error.response?.status == 404) {
        Toast.show({
          type: "error",
          text1: "Internal Server Error",
        });
      }
    } finally {
      setLoading(false);
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
      onBack={() => router.back()}
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
              editable={!loading}
            />

            {/* Bank Name Dropdown */}
            <View className="mb-4">
              <ThemedText className="text-white text-lg">Bank Name</ThemedText>
              <TouchableOpacity
                className="h-12 w-full border border-gray-300 rounded-xl justify-center items-center"
                onPress={() => setModalVisible(true)}
                disabled={loading}
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
              editable={!loading}
            />

            {/* Account Number */}
            <ThemedTextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-white mb-4"
              value={accountNumber}
              onChangeText={setAccountNumber}
              label="Account Number"
              keyboardType="numeric"
              editable={!loading}
            />
          </View>

          {/* Save Button */}
          <View className="flex-row justify-center mt-4">
            <HapticButton
              onPress={handleSaveDetails}
              className="bg-indigo-600/30 py-3 px-8 rounded-xl w-full"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <ThemedText className="text-white text-center text-lg font-semibold">
                  Save Details
                </ThemedText>
              )}
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
