import {
  getBusinessTransactions,
  getCustomerTransactions,
} from "@/services/transactionService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Transaction } from "@/services/interfaceService";
import userImage from "@/assets/images/user.png";

const PAGE_SIZE = 8;

const TransactionsPage = () => {
  const [accountType, setAccountType] = useState<string | null>("");
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [displayedTransactions, setDisplayedTransactions] = useState<
    Transaction[]
  >([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactionsData = async () => {
      try {
        setIsLoading(true);
        const accountType = await AsyncStorage.getItem("current_account_type");
        setAccountType(accountType);
        const fetchedTransactions =
          accountType === "business"
            ? await getBusinessTransactions()
            : await getCustomerTransactions();
        const sorted = fetchedTransactions.transactions.sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setAllTransactions(sorted);
        setDisplayedTransactions(sorted.slice(0, PAGE_SIZE));
        setPage(1);
      } catch (error) {
        console.log("error fetching transactions: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionsData();
  }, []);

  const handleSearch = useCallback(
    (text: string) => {
      setSearch(text);
      const lower = text.toLowerCase();
      if (text.trim() === "") {
        setDisplayedTransactions(allTransactions.slice(0, page * PAGE_SIZE));
      } else {
        const filtered = allTransactions.filter((transaction) => {
          const name = transaction.customer?.name?.toLowerCase() || "";
          const status = transaction.status?.toLowerCase() || "";
          return name.includes(lower) || status.includes(lower);
        });
        setDisplayedTransactions(filtered);
      }
    },
    [allTransactions, page]
  );

  const loadMore = () => {
    if (search.trim() !== "") return;
    const nextPage = page + 1;
    const nextTransactions = allTransactions.slice(0, nextPage * PAGE_SIZE);
    setDisplayedTransactions(nextTransactions);
    setPage(nextPage);
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <View className="flex-row justify-between items-center bg-white rounded-xl mb-4 px-4 py-3 shadow-sm border border-gray-200">
      <Image
        source={
          accountType === "business"
            ? item.customer?.image
              ? { uri: item.customer.image }
              : userImage
            : item.business?.image
            ? { uri: item.business.image }
            : userImage
        }
        className="w-10 h-10 rounded-full mr-4"
      />
      <View className="flex-1">
        <Text className="text-sm font-medium text-gray-900">
          {accountType === "business"
            ? `${item.customer?.name}`
            : `${item.business?.name}`}
        </Text>
        <Text className="text-xs text-gray-400 mt-4">
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      <Text
        className={`text-sm font-medium ${
          item.status === "charged"
            ? "text-red-800"
            : item.status === "open"
            ? "text-green-800"
            : "text-gray-800"
        }`}
      >
        {item.status === "charged"
          ? `${item.amount} ${item.currency}`
          : item.status}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5 pt-6">
        <View className="mb-6">
          <TextInput
            placeholder="Search transactions"
            placeholderTextColor="#6b7280"
            value={search}
            onChangeText={handleSearch}
            className="bg-white text-sm text-gray-700 px-5 py-3 rounded-xl shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#4B5563" className="mt-10" />
      ) : displayedTransactions.length === 0 ? (
        <Text className="text-center text-gray-500 mt-10">
          No transactions found.
        </Text>
      ) : (
        <FlatList
          className="px-5"
          data={displayedTransactions}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={PAGE_SIZE}
        />
      )}
    </SafeAreaView>
  );
};

export default TransactionsPage;
