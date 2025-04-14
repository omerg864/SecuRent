import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Image } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import HapticButton from "../../components/ui/HapticButton";
import { ThemedText } from "@/components/ui/ThemedText";
import userImage from "@/assets/images/user.png";
import {
  chargeDeposit,
  getTransactionById,
} from "@/services/transactionService";
import Toast from "react-native-toast-message";
import { useLocalSearchParams } from "expo-router";
import { Transaction } from "@/services/interfaceService";

const ChargeDepositScreen = () => {
  const { transactionId } = useLocalSearchParams();

  const [transaction, setTransaction] = useState<Transaction>();
  const [customer, setCustomer] = useState<Transaction["customer"]>();
  const [amount, setAmount] = useState<number>(transaction?.amount as number);
  const [reason, setReason] = useState(transaction?.description);
  const [editAmount, setEditAmount] = useState(false);
  const maxAmount = transaction?.amount as number;

  useEffect(() => {
    const getTransactionDetails = async () => {
      try {
        if (!transactionId || typeof transactionId !== "string") {
          Toast.show({
            type: "error",
            text1: "Missing transaction ID",
          });
          return;
        }
        const transactionDetails = await getTransactionById(transactionId);
        setTransaction(transactionDetails);
        setCustomer(transactionDetails.customer);
      } catch (error) {
        console.error("Error fetching details because:  ", error);
      }
    };
    getTransactionDetails();
  }, []);

  const handleChargeDeposit = async () => {
    try {
      if (amount && maxAmount && customer) {
        if (!amount || !maxAmount) {
          Toast.show({
            type: "error",
            text1: "error with transaction details.",
          });
        }
        if (amount <= 0) {
          Toast.show({ type: "error", text1: "Invalid amount" });
          return;
        }

        if (amount > maxAmount) {
          Toast.show({
            type: "error",
            text1: "Amount exceeds maximum deposit",
          });
          return;
        }

        await chargeDeposit(customer?._id, {
          amount: amount,
          charged_description: reason as string,
        });

        Toast.show({
          type: "success",
          text1: "Deposit charged successfully",
          text2: `Amount: ${amount}₪`,
        });
        setAmount(0);
        setReason("");
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Failed to charge deposit",
        text2: error.message || "Please try again later",
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-5 pt-8 pb-12">
      <Text className="text-3xl font-bold mb-8 text-center text-[#2D2A2E]">
        Charge Deposit
      </Text>

      <View className="bg-gray-100 rounded-2xl p-6 flex-row items-center justify-between mb-6 shadow-md border-2 border-gray-300">
        <View className="flex-row items-center space-x-3">
          <Image
            source={customer?.image ? customer?.image : userImage}
            className="w-10 h-10 rounded-full mr-2"
          />
          <Text className="text-base font-semibold text-[#2D2A2E]">
            {customer?.name}
          </Text>
        </View>
        <Text className="text-base font-semibold text-[#2D2A2E]">
          {transaction?.amount}₪
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
            className="border-2 border-gray-300 rounded-lg w-12 h-12 items-center justify-center bg-white"
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
            className="border-2 border-gray-300 rounded-lg w-12 h-12 items-center justify-center bg-white"
          >
            <Text className="text-2xl text-[#2D2A2E]">+</Text>
          </HapticButton>
        </View>
      </View>

      <View>
        <Text className="text-sm text-gray-500 mb-2">Charge Reason</Text>
        <TextInput
          className="bg-gray-100 p-5 rounded-xl text-base text-[#2D2A2E] border border-gray-300"
          value={reason}
          onChangeText={setReason}
        />
      </View>

      <HapticButton
        onPress={handleChargeDeposit}
        className="rounded-full py-5 items-center shadow-md mt-16"
        style={{ backgroundColor: "#4338CA" }} // Updated to indigo-600 equivalent
      >
        <ThemedText className="font-semibold text-lg text-white">
          Charge Deposit
        </ThemedText>
      </HapticButton>
    </ScrollView>
  );
};

export default ChargeDepositScreen;
