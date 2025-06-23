import { View, Text, Image, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HapticButton from '@/components/ui/HapticButton';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef } from 'react';
import { getItemByIdForTransaction } from '@/services/itemService';
import { createTransactionFromItem } from '@/services/transactionService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import ShowToast from '@/components/ui/ShowToast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { startDepositPaymentFlow } from '@/services/stripeService';
import TermsAgreementSection, {
	TermsAgreementSectionRef,
} from '@/components/TermsAgreementSection';
import TransactionSummaryCard from '@/components/TransactionSummaryCard';
import { useCustomer } from '@/context/CustomerContext';

export default function ApproveTransaction() {
	const router = useRouter();
	const params = useLocalSearchParams();
	const id = params.id as string;
	const [loading, setLoading] = useState(false);
	const [loadingApprove, setLoadingApprove] = useState(false);
	const [item, setItem] = useState<any>(null);
	const [customerName, setCustomerName] = useState('John Doe');
	const [hasReadTerms, setHasReadTerms] = useState(false);
	const [transaction, setTransaction] = useState<any>(null);
	const termsRef = useRef<TermsAgreementSectionRef>(null);
	const { customer } = useCustomer();

	useFocusEffect(
		useCallback(() => {
			const fetchItemDetails = async () => {
				setHasReadTerms(false);
				setTransaction(null);
				setLoadingApprove(false);
				setLoading(true);
				try {
					if (customer) {
						setCustomerName(customer.name);
					}
					const response = await createTransactionFromItem(id);
					if (response.data.success) {
						setItem(response.data);
					} else {
						ShowToast('error', 'Item not found');
						router.replace({
							pathname: '/customer',
						});
					}
				} catch (error: any) {
					ShowToast('error', 'Item not found');
					router.replace({
						pathname: '/customer',
					});
				} finally {
					setLoading(false);
				}
			};

			fetchItemDetails();
		}, [id])
	);

	const handleApproveDeposit = async () => {
		try {
			setLoadingApprove(true);

			// const response = await createTransactionFromItem(id);

			// if (!response || !response.data?.success) {
			// 	ShowToast('error', 'Failed to approve deposit');
			// 	setLoadingApprove(false);
			// 	return;
			// }

			// setTransaction({ return_date: response.data.return_date });

			await startDepositPaymentFlow({
				customerId: item.customer_stripe_id,
				ephemeralKey: item.ephemeralKey,
				clientSecret: item.clientSecret,
				transactionId: item.transactionId,
				onSuccess: () => router.replace({ pathname: '/customer' }),
				onFail: () => setLoadingApprove(false),
			});
		} catch (error: any) {
			console.log(
				'Error response:',
				error?.response?.data?.message || error.message
			);
			ShowToast(
				'error',
				error?.response?.data?.message || 'An unexpected error occurred'
			);
			setLoadingApprove(false);
		}
	};

	const handleGoToBusinessProfile = () => {
		router.push({
			pathname: '/customer/BusinessProfileScreen',
			params: { id: item.business?._id },
		});
	};

	if (loading || !item)
		return <LoadingSpinner label="Loading transaction details..." />;

	let returnDate: Date;

	if (transaction?.return_date) {
		returnDate = new Date(transaction.return_date);
	} else if (item.return_date) {
		returnDate = new Date(item.return_date);
	} else {
		returnDate = new Date(); // fallback to current time
	}

	return (
		<SafeAreaView className="flex-1 bg-indigo-900">
			<StatusBar barStyle="light-content" />
			{/* Header */}
			<View className="flex-row items-center px-4 pt-4">
				<HapticButton
					onPress={() => router.back()}
					className="p-2 bg-indigo-700 rounded-full"
				>
					<Ionicons name="chevron-back" size={24} color="white" />
				</HapticButton>
				<View className="px-6 pt-2">
					<Text className="text-2xl font-semibold text-white">
						Hello {customerName}
					</Text>
					<Text className="text-white/70 text-md">New deposit</Text>
				</View>
			</View>

			{/* Payment Card */}
			<TransactionSummaryCard
				item={item.transaction}
				returnDate={returnDate}
				onPressBusiness={handleGoToBusinessProfile}
			/>

			{/* Terms and Conditions Section */}
			<TermsAgreementSection
				ref={termsRef}
				hasReadTerms={hasReadTerms}
				onToggle={() => setHasReadTerms(!hasReadTerms)}
			/>

			{/* Approve Button */}
			<View className="bottom-10 absolute left-0 right-0 px-6">
				<HapticButton
					onPress={() => {
						if (!hasReadTerms) {
							termsRef.current?.triggerShake();
							return;
						}
						handleApproveDeposit();
					}}
					className={`py-4 rounded-full items-center justify-center ${
						hasReadTerms ? 'bg-white' : 'bg-white/40'
					}`}
					disabled={loadingApprove}
				>
					{loadingApprove ? (
						<ActivityIndicator size="small" color="black" />
					) : (
						<Text className="text-lg font-semibold text-indigo-900">
							Approve deposit
						</Text>
					)}
				</HapticButton>
			</View>
		</SafeAreaView>
	);
}
