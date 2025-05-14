import { View, Text, Image, StatusBar, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/HapticButton";
import { useLocalSearchParams } from "expo-router";
import HapticButton from "@/components/ui/HapticButton";
import StarRating from "@/components/StarRating";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { getItemByIdForTransaction } from "@/services/itemService";
import {
    confirmTransactionPayment,
    createTransactionFromItem
} from "@/services/transactionService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useStripe } from "@stripe/stripe-react-native";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { formatCurrencySymbol } from "@/utils/functions";
import ShowToast from "@/components/ui/ShowToast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Animated } from "react-native";
import { useRef } from "react";

export default function ApproveTransaction() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const id = params.id as string;
    const [loading, setLoading] = useState(false);
    const [loadingApprove, setLoadingApprove] = useState(false);
    const [item, setItem] = useState<any>(null);
    const [customerName, setCustomerName] = useState("John Doe");
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [hasReadTerms, setHasReadTerms] = useState(false);
    const [transaction, setTransaction] = useState<any>(null);
    const shakeAnim = useRef(new Animated.Value(0)).current;

    useFocusEffect(
        useCallback(() => {
            const fetchItemDetails = async () => {
                setHasReadTerms(false);
                setTransaction(null);
                setLoading(true);
                try {
                    const customerData = await AsyncStorage.getItem(
                        "Customer_Data"
                    );
                    const customer = customerData
                        ? JSON.parse(customerData)
                        : null;
                    if (customer) {
                        setCustomerName(customer.name);
                    }
                    const response = await getItemByIdForTransaction(id);
                    if (response.success) {
                        setItem(response.item);
                    } else {
                        ShowToast("error", "Item not found");
                        router.replace({
                            pathname: "/customer"
                        });
                    }
                } catch (error: any) {
                    ShowToast("error", "Item not found");
                    router.replace({
                        pathname: "/customer"
                    });
                } finally {
                    setLoading(false);
                }
            };

            fetchItemDetails();
        }, [id])
    );

    const openStripePaymentSheet = async (
        clientStripeId: string,
        ephemeralKey: string,
        clientSecret: string,
        transactionId: string
    ) => {
        const { error: initError } = await initPaymentSheet({
            customerId: clientStripeId,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: clientSecret,
            merchantDisplayName: "Securent inc."
        });

        if (initError) {
            console.log("Init error:", initError);
            return;
        }

        const { error: sheetError, paymentOption } =
            await presentPaymentSheet();

        if (sheetError) {
            console.log("Payment sheet error:", sheetError);
            ShowToast("error", sheetError.code);
            return;
        }

        try {
            const response = await confirmTransactionPayment(transactionId);

            if (!response.success) {
                ShowToast("error", "Failed to confirm payment");
                return;
            }

            ShowToast("success", "Deposit approved successfully");
            router.replace({
                pathname: "/customer"
            });
        } catch (error: any) {
            console.log(
                "Error confirming payment:",
                error.response.data.message
            );
            ShowToast("error", error.response.data.message);
            return;
        }

        setLoadingApprove(false);
    };

    const handleApproveDeposit = async () => {
        try {
            setLoadingApprove(true);
            const response = await createTransactionFromItem(id);
            if (response) {
                setTransaction({ return_date: response.data.return_date });
                openStripePaymentSheet(
                    response.data.customer_stripe_id,
                    response.data.ephemeralKey,
                    response.data.clientSecret,
                    response.data.transactionId
                );
            } else {
                ShowToast("error", "Failed to approve deposit");
                setLoadingApprove(false);
            }
        } catch (error: any) {
            console.log("Error response:", error.response.data.message);
            ShowToast("error", error.response.data.message);
            setLoadingApprove(false);
        }
    };

    const handleGoToBusinessProfile = () => {
        router.push({
            pathname: "/customer/BusinessProfileScreen",
            params: { id: item.business?._id }
        });
    };

    const triggerShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, {
                toValue: 8,
                duration: 50,
                useNativeDriver: true
            }),
            Animated.timing(shakeAnim, {
                toValue: -8,
                duration: 50,
                useNativeDriver: true
            }),
            Animated.timing(shakeAnim, {
                toValue: 6,
                duration: 50,
                useNativeDriver: true
            }),
            Animated.timing(shakeAnim, {
                toValue: -6,
                duration: 50,
                useNativeDriver: true
            }),
            Animated.timing(shakeAnim, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true
            })
        ]).start();
    };

    if (loading || !item)
        return <LoadingSpinner label='Loading transaction details...' />;

    const businessName = item.business?.name ?? "VIP User";
    const rating = item.business?.rating?.overall ?? 0;
    let returnDate: Date;

    if (transaction?.return_date) {
        returnDate = new Date(transaction.return_date);
    } else if (item.return_date) {
        returnDate = new Date(item.return_date);
    } else {
        returnDate = new Date(); // fallback to current time
    }
    const formattedDate = returnDate.toLocaleDateString();
    const formattedTime = returnDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    return (
        <SafeAreaView className='flex-1 bg-indigo-900'>
            <StatusBar barStyle='light-content' />
            <View>
                {/* Header */}
                <View className='px-4 pt-4 flex-row items-center'>
                    <HapticButton
                        onPress={() => router.back()}
                        className='p-2 rounded-full bg-indigo-700'
                    >
                        <Ionicons
                            name='chevron-back'
                            size={24}
                            color='white'
                        />
                    </HapticButton>
                    <View className='px-6 pt-2'>
                        <Text className='text-white text-2xl font-semibold'>
                            Hello {customerName}
                        </Text>
                        <Text className='text-white/70 text-md'>
                            New deposit
                        </Text>
                    </View>
                </View>

                {/* Payment Card */}
                <View className='mx-6 mt-8 bg-indigo-800 rounded-3xl p-6'>
                    {/* Business Info */}
                    <View className='flex-row items-start pb-4 border-b border-white/20'>
                        <View className='w-16 h-16 rounded-full bg-gray-300 items-center justify-center overflow-hidden mr-4'>
                            {item.business?.image ? (
                                <Image
                                    source={{ uri: item.business.image }}
                                    className='w-full h-full'
                                />
                            ) : (
                                <Ionicons
                                    name='business-outline'
                                    size={48}
                                    color='white'
                                />
                            )}
                        </View>

                        <View className='flex-1'>
                            <Text className='text-white/90 text-lg font-semibold mb-1'>
                                {businessName}
                            </Text>

                            <View className='flex-row items-center'>
                                <StarRating rating={rating} />

                                <HapticButton
                                    onPress={handleGoToBusinessProfile}
                                    className='ml-2 px-2 py-0.5 rounded-full bg-white/20'
                                >
                                    <Text className='text-white text-xs font-medium'>
                                        View Profile
                                    </Text>
                                </HapticButton>
                            </View>
                        </View>
                    </View>

                    {/* Payment Details */}
                    <View className='mb-4 mt-4'>
                        <Text className='text-white/70 text-lg mb-2 font-semibold text-center'>
                            The deposit fee is:
                        </Text>
                        <Text className='text-white text-3xl font-bold text-center'>
                            {item.price} {formatCurrencySymbol(item.currency)}
                        </Text>
                    </View>

                    {/* Additional Info */}
                    <View className='mb-6'>
                        <Text className='text-white text-xl font-semibold text-center'>
                            {item.description}
                        </Text>
                    </View>

                    {/* Return Info */}
                    <View className='flex-row justify-between'>
                        <View>
                            <Text className='text-white/70 text-lg font-semibold '>
                                Return date
                            </Text>
                            <Text className='text-white text-md mt-1 text-center font-semibold'>
                                {formattedDate}
                            </Text>
                        </View>
                        <View>
                            <Text className='text-white/70 text-lg font-semibold'>
                                Return time
                            </Text>
                            <Text className='text-white text-md mt-1 text-center font-semibold'>
                                {formattedTime}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Terms and Conditions Section */}
            <View>
                {/* Highlight */}
                <Text className='text-white/80 text-md text-center font-semibold mb-2 mt-6'>
                    Please read and approve before proceeding
                </Text>

                {/* Rental terms content */}
                <ScrollView className='self-center bg-indigo-700/20 border border-white/10 mx-6 p-4 rounded-xl max-h-[80px] max-w-[340px]'>
                    <Text className='leading-8 text-white/90 text-md mb-4'>
                        Rental Terms:
                        {"\n"}1. You must return the item on time.
                        {"\n"}2. Late returns may result in additional charges.
                        {"\n"}3. Damaged items may incur extra fees.
                        {"\n"}4. The business reserves the right to withhold the
                        deposit if necessary.
                    </Text>
                </ScrollView>

                {/* Checkbox centered below */}
                <Animated.View
                    style={{ transform: [{ translateX: shakeAnim }] }}
                >
                    <View className='flex-row items-center mt-4 px-10'>
                        <TouchableOpacity
                            onPress={() => setHasReadTerms(!hasReadTerms)}
                            className='w-5 h-5 border border-white/60 mr-3 items-center justify-center'
                        >
                            {hasReadTerms && (
                                <View className='w-3 h-3 bg-white' />
                            )}
                        </TouchableOpacity>
                        <Text className='text-white/80 text-md font-semibold'>
                            I have read and understood the terms
                        </Text>
                    </View>
                </Animated.View>
            </View>

            {/* Approve Button */}
            <View className='absolute bottom-10 left-0 right-0 px-6'>
                <Button
                    onPress={() => {
                        if (!hasReadTerms) {
                            triggerShake();
                            return;
                        }
                        handleApproveDeposit();
                    }}
                    className={`py-4 rounded-full items-center justify-center ${
                        hasReadTerms ? "bg-white" : "bg-white/40"
                    }`}
                    disabled={loadingApprove}
                >
                    {loadingApprove ? (
                        <ActivityIndicator
                            size='small'
                            color='black'
                        />
                    ) : (
                        <Text className='text-indigo-900 font-semibold text-lg'>
                            Approve deposit
                        </Text>
                    )}
                </Button>
            </View>
        </SafeAreaView>
    );
}
