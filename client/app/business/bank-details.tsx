import React, { useState } from "react";
import {
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedTextInput } from "@/components/ui/ThemedTextInput";
import { ThemedText } from "@/components/ui/ThemedText";
import HapticButton from "@/components/ui/HapticButton";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";

const BankDetailsScreen = () => {
  const router = useRouter();

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

  const handleSaveDetails = () => {
    // Add logic to save the bank details (API call, etc.)
    router.push("/business/buisness-setup"); // Redirect after saving details
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
              className="bg-indigo-500 py-3 px-8 rounded-xl w-full"
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
