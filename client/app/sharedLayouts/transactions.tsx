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
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Transaction } from "@/services/interfaceService";
import userImage from "@/assets/images/user.png";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const PAGE_SIZE = 8;

const statusColors: { [key: string]: string } = {
  charged: "text-red-500",
  open: "text-green-500",
  closed: "text-gray-500",
};

const TransactionsPage = () => {
  const [accountType, setAccountType] = useState<string | null>("");
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [displayedTransactions, setDisplayedTransactions] = useState<
    Transaction[]
  >([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
        const sorted = fetchedTransactions.success
          ? fetchedTransactions.transactions.sort(
              (a: Transaction, b: Transaction) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
          : [];
        setAllTransactions(sorted);
        setPage(1);
      } catch (error) {
        console.log("error fetching transactions: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionsData();
  }, []);

  const applyFilters = useCallback(() => {
    const lower = search.toLowerCase();

    const filtered = allTransactions.filter((transaction) => {
      const name =
        transaction.customer?.name?.toLowerCase() ||
        transaction.business?.name?.toLowerCase() ||
        "";
      const status = transaction.status?.toLowerCase() || "";

      const matchSearch =
        search.trim() === "" || name.includes(lower) || status.includes(lower);

      const matchStatus = statusFilter === "all" || status === statusFilter;

      return matchSearch && matchStatus;
    });

    const sorted = filtered
      .filter((t) => t.createdAt)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    setDisplayedTransactions(sorted.slice(0, page * PAGE_SIZE));
  }, [search, statusFilter, allTransactions, page]);

  useEffect(() => {
    applyFilters();
  }, [search, statusFilter, allTransactions, page]);

  const loadMore = () => {
    if (search.trim() !== "") return;
    const nextPage = page + 1;
    const nextTransactions = allTransactions.slice(0, nextPage * PAGE_SIZE);
    setDisplayedTransactions(nextTransactions);
    setPage(nextPage);
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    const colorClass = statusColors[item.status] ?? "text-gray-700";

    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/sharedLayouts/transaction-details",
            params: { id: item._id },
          })
        }
        className="flex-row justify-between items-center bg-white rounded-xl mb-4 px-4 py-3 shadow-sm border border-gray-200"
      >
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
            {new Date(item.createdAt).toLocaleString([], {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </Text>
        </View>
        <Text className={`text-sm font-medium ${colorClass}`}>
          {item.status === "charged"
            ? `${item.amount} ${item.currency}`
            : item.status}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* rest of your JSX including search and filters */}
      <FlatList
        className="px-5"
        data={displayedTransactions}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={PAGE_SIZE}
      />
    </SafeAreaView>
  );

};


export default TransactionsPage;