import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import HapticButton from "@/components/ui/HapticButton";
import { ThemedText } from "@/components/ui/ThemedText";
import userImage from "@/assets/images/user.png";
import {
  chargeDeposit,
  getTransactionById,
} from "@/services/transactionService";
import { useLocalSearchParams } from "expo-router";
import { Transaction } from "@/services/interfaceService";
import PriceSelector from "@/components/PriceSelector";
import ShowToast from "@/components/ui/ShowToast";

const ChargeDepositScreen = () => {
  const { transactionId } = useLocalSearchParams<{ transactionId: string }>();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<Transaction>();
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");

  const customer = transaction?.customer;
  const maxAmount = transaction?.amount ?? 0;

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId) {
        ShowToast("error", "Missing transaction ID");
        return;
      }

      try {
        const data = await getTransactionById(transactionId);
        setTransaction(data);
        setAmount(0);
      } catch (error) {
        console.error("Error fetching transaction:", error);
        ShowToast("error", "Failed to load transaction details");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  const handleChargeDeposit = async () => {
    if (!transaction) return;

    if (amount <= 0) return ShowToast("error", "Invalid amount");
    if (amount > maxAmount)
      return ShowToast("error", "Amount exceeds maximum deposit");

    try {
      await chargeDeposit(transaction._id, {
        amount,
        charged_description: reason,
      });

      ShowToast(
        "success",
        "Deposit charged successfully",
        `Amount: ${amount}₪`
      );
      setAmount(0);
      setReason("");
    } catch (error: any) {
      ShowToast("error", "Failed to charge deposit", error?.message);
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
            source={customer?.image || userImage}
            className="w-10 h-10 rounded-full mr-2"
          />
          <Text className="text-base font-semibold text-[#2D2A2E]">
            {customer?.name || "Customer"}
          </Text>
        </View>
        <Text className="text-base font-semibold text-[#2D2A2E]">
          {transaction?.amount ?? "0"} ₪
        </Text>
      </View>

      <Text className="text-center text-gray-500 mb-2">
        Max chargeable amount: {maxAmount}₪
      </Text>

      <PriceSelector
        title="Set Amount"
        price={amount}
        setPrice={setAmount}
        maxPrice={maxAmount}
        steps={50}
        currency="ILS"
        displayPriceList={false}
      />

      <View className="mt-4">
        <Text className="text-sm text-gray-500 mb-2">Charge Reason</Text>
        <TextInput
          className="bg-gray-100 p-5 rounded-xl text-base text-[#2D2A2E] border border-gray-300"
          value={reason}
          onChangeText={setReason}
          placeholder="Enter reason"
        />
      </View>

      <HapticButton
        onPress={handleChargeDeposit}
        className="rounded-full py-5 items-center shadow-md mt-16"
        style={{ backgroundColor: "#4338CA" }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <ThemedText className="font-semibold text-lg text-white">
            Charge Deposit
          </ThemedText>
        )}
      </HapticButton>
    </ScrollView>
  );
};

export default ChargeDepositScreen;
