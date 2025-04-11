"use client";

import { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import HapticButton from "@/components/ui/HapticButton";
import { ThemedText } from "@/components/ui/ThemedText";
import Toast from "react-native-toast-message";

import {
  getTransactionById,
  closeTransaction,
} from "@/services/transactionService";
import { Transaction } from "@/services/interfaceService";

const HARDCODED_ID = "67f3e5eb23ca213ee0de136f";

export default function TransactionDetails() {
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        console.log("📦 Fetching transaction...");
        const data = await getTransactionById(HARDCODED_ID);
        console.log("🚀 Transaction data:", data);
        setTransaction(data);
        setIsOpen(data.status === "open");
      } catch (error: any) {
        console.error("❌ Error fetching transaction:", error);
        Toast.show({
          type: "error",
          text1: "Failed to load transaction",
          text2: error.message || "Please try again later",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, []);

  const handleCloseTransaction = async () => {
    try {
      const updated = await closeTransaction(HARDCODED_ID);
      setTransaction(updated);
      setIsOpen(false);
      Toast.show({
        type: "success",
        text1: "Transaction closed successfully",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Failed to close transaction",
        text2: error.message || "Try again",
      });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-4 text-gray-600">Loading transaction...</Text>
      </View>
    );
  }

  if (!transaction) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <Text className="text-lg font-semibold text-red-600">
          Transaction not found.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <View className="px-4 pt-2 flex-row items-center justify-center relative h-14">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 absolute left-4 border border-black rounded-full"
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <ThemedText className="text-lg font-medium text-black">
          Transaction Details
        </ThemedText>
      </View>

      <ScrollView className="flex-1 px-6">
        <View className="items-center mb-8 mt-4">
          <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center mb-2">
            <ThemedText className="text-2xl font-bold text-blue-600">
              {transaction.customer?.name?.[0] ||
                transaction.business?.name?.[0] ||
                "?"}
            </ThemedText>
          </View>
          <ThemedText className="text-lg font-medium text-black">
            {transaction.customer?.name || transaction.business?.name}
          </ThemedText>
        </View>

        <View className="mb-6 bg-gray-50 rounded-lg py-4">
          <Row
            label="Start Date"
            value={new Date(transaction.createdAt).toLocaleDateString()}
          />
          <Row
            label="Start Time"
            value={new Date(transaction.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        </View>

        {!isOpen && (
          <View className="mb-6 bg-gray-50 rounded-lg py-4">
            <Row
              label="End Date"
              value={
                transaction.return_date
                  ? new Date(transaction.return_date).toLocaleDateString()
                  : "-"
              }
            />
            <Row
              label="End Time"
              value={
                transaction.return_date
                  ? new Date(transaction.return_date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"
              }
            />
          </View>
        )}

        <View className="mb-6 bg-gray-50 rounded-lg py-4">
          <Row label="Description" value={transaction.description || "-"} />
          <Row
            label="Amount"
            value={`${transaction.amount} ${transaction.currency}`}
          />
        </View>

        <View className="flex-row bg-gray-50">
          <View className="flex-1 p-4">
            <ThemedText className="text-sm text-gray-600">Status</ThemedText>
          </View>
          <View className="flex-1 p-4 items-end">
            <ThemedText
              className={`text-sm font-medium ${
                isOpen ? "text-green-700" : "text-gray-700"
              }`}
            >
              {transaction.status}
            </ThemedText>
          </View>
        </View>

        {transaction.charged_description && (
          <View className="mb-6 bg-gray-50 rounded-lg py-4 mt-4">
            <Row
              label="Charged Reason"
              value={transaction.charged_description}
            />
          </View>
        )}
      </ScrollView>

      {isOpen && (
        <View className="absolute bottom-4 left-0 right-0 px-6 pb-6 bg-white">
          <HapticButton
            className="bg-red-500 rounded-full py-4 items-center mb-3"
            onPress={() => console.log("Charge Deposit")}
          >
            <ThemedText className="text-white font-semibold text-lg">
              Charge Deposit
            </ThemedText>
          </HapticButton>

          <HapticButton
            className="bg-blue-600 rounded-full py-4 items-center"
            onPress={handleCloseTransaction}
          >
            <ThemedText className="text-white font-semibold text-lg">
              Close Transaction
            </ThemedText>
          </HapticButton>
        </View>
      )}
    </SafeAreaView>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row">
    <View className="flex-1 p-4">
      <ThemedText className="text-sm text-gray-600">{label}</ThemedText>
    </View>
    <View className="flex-1 p-4 items-end">
      <ThemedText className="text-sm font-medium text-black">{value}</ThemedText>
    </View>
  </View>
);
