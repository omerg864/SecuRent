"use client";
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import HapticButton from "@/components/ui/HapticButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Transaction } from "@/services/interfaceService";
import { getBusinessTransactions } from "@/services/transactionService";

const BusinessHomePage = () => {
  const [openedTransactions, setOpenTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleNewTransaction = () => {
    // Navigate to new transaction page
    router.push("/business/new-transaction");
  };

  const handleTransactionPress = (id: string) => {
    // Navigate to transaction details
    router.push(`./bank-details`);
  };

  useEffect(() => {
    const getOpenedTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await getBusinessTransactions();
        const openTransactions = data.transactions.filter(
          (t) => t.status === "open"
        );
        console.log("filtered: ", openTransactions);
        setOpenTransactions(openTransactions);
      } catch (error) {
        console.log("Failed to fetch opened transactions because: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    getOpenedTransactions();
  }, []);

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 px-4">
        {/* New Transaction Button */}
        <HapticButton
          className="bg-white rounded-full py-4 items-center mb-5 shadow-lg mt-5"
          style={{ backgroundColor: "#4338CA" }}
          onPress={handleNewTransaction}
        >
          <ThemedText className="text-white font-semibold text-lg">
            New Transaction
          </ThemedText>
        </HapticButton>

        {/* Active Transactions */}
        <View className="bg-white rounded-xl overflow-hidden shadow-lg">
          <View className="flex-row justify-between items-center py-4 px-4 border-b border-gray-200">
            <ThemedText
              style={{ color: "black" }}
              className="text-lg font-semibold"
            >
              Active Transactions
            </ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </View>

          {/* Transaction List */}
          {isLoading ? (
            <ActivityIndicator size="small" color="#4B5563" className="mt-20" />
          ) : (
            openedTransactions.map((transaction) => (
              <TouchableOpacity
                key={transaction._id}
                className="flex-row items-center py-3 px-4 border-b border-gray-200"
                onPress={() => handleTransactionPress(transaction._id)}
              >
                <View className="flex-1">
                  <ThemedText
                    style={{ color: "black" }}
                    className="text-base font-medium mb-1"
                  >
                    {transaction.customer?.name}
                  </ThemedText>
                  <ThemedText style={{ color: "grey" }} className="text-sm">
                    {transaction.description}
                  </ThemedText>
                </View>
                <ThemedText
                  style={{ color: "black" }}
                  className="text-base font-semibold"
                >
                  {transaction.amount}
                </ThemedText>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default BusinessHomePage;
