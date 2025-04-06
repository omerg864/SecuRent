import React, { useState } from "react";
import { View, Text, TextInput, Image } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import HapticButton from "../../components/ui/HapticButton";
import { ThemedText } from "@/components/ui/ThemedText";
import userImage from "../../assets/images/user.png";
import { chargeDeposit } from "@/services/transactionService";
import Toast from "react-native-toast-message";

export default function ChargeDepositScreen() {
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("broken tire");
  const [editAmount, setEditAmount] = useState(false);
  const maxAmount = 600;
  const customerId = "someCustomerId";

  const presetAmounts = [maxAmount * 0.1, maxAmount * 0.5, maxAmount];

  const handleChargeDeposit = async () => {
    if (amount <= 0) {
      Toast.show({ type: "error", text1: "Invalid amount" });
      return;
    }

    try {
      const response = await chargeDeposit({
        id: customerId,
        charged_description: reason,
        amount,
      });

      if (response.success) {
        Toast.show({
          type: "success",
          text1: "transaction has been",
        });
        setAmount(0);
      } else {
        Toast.show({ type: "error", text1: `${response.message}` });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Something went wrong" });
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#F5F5F5] px-5 pt-8 pb-12">
      <Text className="text-3xl font-bold mb-8 text-center text-[#2D2A2E]">
        Charge Deposit
      </Text>

      <View className="bg-white rounded-2xl p-6 flex-row items-center justify-between mb-6 shadow-md">
        <View className="flex-row items-center space-x-3">
          <Image source={userImage} className="w-10 h-10 rounded-full mr-2" />
          <Text className="text-base font-semibold text-[#2D2A2E]">
            John Doe
          </Text>
        </View>
        <Text className="text-base font-semibold text-[#2D2A2E]">
          {maxAmount}₪
        </Text>
      </View>

      <Text className="text-center text-gray-500 mb-2">
        John has deposited {maxAmount}₪ so this is the maximum amount you can
        charge.
      </Text>

      <Text className="text-center text-xl text-[#2D2A2E] mb-6">
        SET AMOUNT
      </Text>

      <View className="items-center mb-8">
        <View className="flex-row items-center space-x-8">
          <HapticButton
            onPress={() => setAmount(Math.max(0, amount - 50))}
            className="border-2 border-[#D1D5DB] rounded-lg w-12 h-12 items-center justify-center"
          >
            <Text className="text-2xl text-[#2D2A2E]">-</Text>
          </HapticButton>

          <TouchableOpacity
            className="items-center justify-center"
            onPress={() => setEditAmount(true)}
          >
            {editAmount ? (
              <TextInput
                className="text-2xl font-medium text-center w-24 text-[#2D2A2E]"
                keyboardType="numeric"
                value={amount.toString()}
                onChangeText={(t) => setAmount(parseInt(t) || 0)}
                onBlur={() => setEditAmount(false)}
                autoFocus
              />
            ) : (
              <Text className="text-2xl font-medium w-24 text-center text-[#2D2A2E]">
                {amount > 0 ? `${amount}₪` : amount}
              </Text>
            )}
          </TouchableOpacity>

          <HapticButton
            onPress={() => setAmount(Math.min(maxAmount, amount + 50))}
            className="border-2 border-[#D1D5DB] rounded-lg w-12 h-12 items-center justify-center"
          >
            <Text className="text-2xl text-[#2D2A2E]">+</Text>
          </HapticButton>
        </View>
      </View>

      <View className="flex-row justify-between mb-10 space-x-2">
        {presetAmounts.map((val) => (
          <HapticButton
            key={val}
            onPress={() => setAmount(val)}
            className={`flex-1 py-3 rounded-full border ${
              amount === val ? "bg-[#6F48EB]" : "border-[#6F48EB]"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                amount === val ? "text-white" : "text-[#6F48EB]"
              }`}
            >
              {val}₪
            </Text>
          </HapticButton>
        ))}
      </View>

      <View>
        <Text className="text-sm text-gray-500 mb-2">Charge Reason</Text>
        <TextInput
          className="bg-white p-5 rounded-xl text-base text-[#2D2A2E] shadow-sm"
          value={reason}
          onChangeText={setReason}
        />
      </View>

      <HapticButton
        onPress={handleChargeDeposit}
        className="rounded-full py-5 items-center shadow-md mt-16"
        style={{ backgroundColor: "#4338CA" }} // Purple from the screenshot
      >
        <ThemedText className="font-semibold text-lg text-white">
          Charge Deposit
        </ThemedText>
      </HapticButton>
    </ScrollView>
  );
}
