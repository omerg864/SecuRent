"use client"

import { useState } from "react"
import { View, TouchableOpacity, StatusBar, SafeAreaView, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter, useLocalSearchParams } from "expo-router"
import HapticButton from "@/components/ui/HapticButton"
import { ThemedText } from "@/components/ui/ThemedText"

export default function TransactionDetails() {
    const router = useRouter()
    const params = useLocalSearchParams()
    const [isOpen, setIsOpen] = useState(true)

    // Transaction data (would normally come from API/params)
    const transaction = {
        id: params.id || "1",
        customerName: "John Doe",
        date: "10 Sep, 2021",
        time: "12:03 AM",
        returnDate: "10 Sep, 2021",
        returnTime: "14:03 AM",
        description: "bike bmx8",
        amount: "600₪",
        status: isOpen ? "Open" : "Closed",
    }

    const handleCloseTransaction = () => {
        // In a real app, you would call an API to update the transaction status
        setIsOpen(false)
    }

    const handleChargeDeposit = () => {
        // Handle deposit charging logic
        console.log("Charging deposit")
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View className="px-4 pt-2 flex-row items-center justify-center relative h-14">
                <TouchableOpacity onPress={() => router.back()} className="p-2 absolute left-2">
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <ThemedText style={{ color: "black" }} className="text-lg font-medium">
                    Transactions Details
                </ThemedText>
            </View>

            <ScrollView className="flex-1 px-6">
                {/* User Avatar */}
                <View className="items-center mb-8 mt-4">
                    <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center mb-2">
                        <ThemedText style={{ color: "blue" }} className="text-2xl font-bold">
                            J
                        </ThemedText>
                    </View>
                    <ThemedText style={{ color: "black" }} className="text-lg font-medium">
                        {transaction.customerName}
                    </ThemedText>
                </View>

                {/* Transaction Date/Time */}
                <View className="mb-6">
                    <View className="flex-row bg-gray-50 rounded-lg mb-2">
                        <View className="flex-1 p-4">
                            <ThemedText style={{ color: "gray" }} className="text-sm">
                                Start Date
                            </ThemedText>
                        </View>
                        <View className="flex-1 p-4 items-end">
                            <ThemedText style={{ color: "black" }} className="text-sm font-medium">
                                {transaction.date}
                            </ThemedText>
                        </View>
                    </View>

                    <View className="flex-row bg-gray-50 rounded-lg">
                        <View className="flex-1 p-4">
                            <ThemedText style={{ color: "gray" }} className="text-sm">
                                Start Time
                            </ThemedText>
                        </View>
                        <View className="flex-1 p-4 items-end">
                            <ThemedText style={{ color: "black" }} className="text-sm font-medium">
                                {transaction.time}
                            </ThemedText>
                        </View>
                    </View>
                </View>

                {/* Return Date/Time (only shown when closed) */}
                {!isOpen && (
                    <View className="mb-6">
                        <View className="flex-row bg-gray-50 rounded-lg mb-2">
                            <View className="flex-1 p-4">
                                <ThemedText style={{ color: "gray" }} className="text-sm">
                                    End Date
                                </ThemedText>
                            </View>
                            <View className="flex-1 p-4 items-end">
                                <ThemedText style={{ color: "black" }} className="text-sm font-medium">
                                    {transaction.returnDate}
                                </ThemedText>
                            </View>
                        </View>

                        <View className="flex-row bg-gray-50 rounded-lg">
                            <View className="flex-1 p-4">
                                <ThemedText style={{ color: "gray" }} className="text-sm">
                                    End Time
                                </ThemedText>
                            </View>
                            <View className="flex-1 p-4 items-end">
                                <ThemedText style={{ color: "black" }} className="text-sm font-medium">
                                    {transaction.returnTime}
                                </ThemedText>
                            </View>
                        </View>
                    </View>
                )}

                {/* Description and Amount */}
                <View className="mb-6">
                    <View className="flex-row bg-gray-50 rounded-lg mb-2">
                        <View className="flex-1 p-4">
                            <ThemedText style={{ color: "gray" }} className="text-sm">
                                Description
                            </ThemedText>
                        </View>
                        <View className="flex-1 p-4 items-end">
                            <ThemedText style={{ color: "black" }} className="text-sm font-medium">
                                {transaction.description}
                            </ThemedText>
                        </View>
                    </View>

                    <View className="flex-row bg-gray-50 rounded-lg">
                        <View className="flex-1 p-4">
                            <ThemedText style={{ color: "gray" }} className="text-sm">
                                Amount
                            </ThemedText>
                        </View>
                        <View className="flex-1 p-4 items-end">
                            <ThemedText style={{ color: "black" }} className="text-sm font-medium">
                                {transaction.amount}
                            </ThemedText>
                        </View>
                    </View>
                </View>

                {/* Status */}
                <View className="mb-6">
                    <View className="flex-row bg-gray-50 rounded-lg">
                        <View className="flex-1 p-4">
                            <ThemedText style={{ color: "gray" }} className="text-sm">
                                Status
                            </ThemedText>
                        </View>
                        <View className="flex-1 p-4 items-end">
                            <ThemedText style={{ color: isOpen ? "green" : "black" }} className="text-sm font-medium">
                                {transaction.status}
                            </ThemedText>
                        </View>
                    </View>
                </View>

                {/* Additional description field when closed */}
                {!isOpen && (
                    <View className="mb-6">
                        <View className="flex-row bg-gray-50 rounded-lg">
                            <View className="flex-1 p-4">
                                <ThemedText style={{ color: "gray" }} className="text-sm">
                                    Description
                                </ThemedText>
                            </View>
                            <View className="flex-1 p-4 items-end">
                                <ThemedText style={{ color: "black" }} className="text-sm font-medium"></ThemedText>
                            </View>
                        </View>
                    </View>
                )}

                {/* Action Buttons - only shown when transaction is open */}
                {isOpen && (
                    <View className="mt-4 mb-8">
                        <HapticButton className="bg-red-500 rounded-full py-4 items-center mb-3" onPress={handleChargeDeposit}>
                            <ThemedText className="text-white font-semibold text-lg">Charge Deposit</ThemedText>
                        </HapticButton>

                        <HapticButton className="bg-blue-600 rounded-full py-4 items-center" onPress={handleCloseTransaction}>
                            <ThemedText className="text-white font-semibold text-lg">Close Transaction</ThemedText>
                        </HapticButton>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

