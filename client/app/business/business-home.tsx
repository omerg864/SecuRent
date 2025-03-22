"use client";
import { View, TouchableOpacity, ScrollView } from "react-native";
import HapticButton from "@/components/ui/HapticButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const BusinessHomePage = () => {
  const router = useRouter();

  const handleNewTransaction = () => {
    // Navigate to new transaction page
    router.push("./bank-details");
  };

  const handleTransactionPress = (id: string) => {
    // Navigate to transaction details
    router.push(`./bank-details`);
  };

  const transactions = [
    {
      id: "1",
      name: "John Griggs",
      description: "Received on 12 Jul",
      amount: "600$",
    },
    {
      id: "2",
      name: "The Place Restaurant",
      description: "Received on 10 Jul",
      amount: "301$",
    },
    {
      id: "3",
      name: "Transfer to Philip",
      description: "Sent on 9 Jul",
      amount: "1,010$",
    },
    {
      id: "4",
      name: "Habits Yogurt",
      description: "Received on 5 Jul",
      amount: "101$",
    },
  ];

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
          {transactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              className="flex-row items-center py-3 px-4 border-b border-gray-200"
              onPress={() => handleTransactionPress(transaction.id)}
            >
              <View className="flex-1">
                <ThemedText
                  style={{ color: "black" }}
                  className="text-base font-medium mb-1"
                >
                  {transaction.name}
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
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default BusinessHomePage;
