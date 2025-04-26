import React, { useEffect, useMemo, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	Image,
	ActivityIndicator,
	ScrollView,
} from 'react-native';
import HapticButton from '@/components/ui/HapticButton';
import { ThemedText } from '@/components/ui/ThemedText';
import {
	chargeDeposit,
	getTransactionById,
} from '@/services/transactionService';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { Transaction } from '@/services/interfaceService';
import PriceSelector from '@/components/PriceSelector';
import Toast from 'react-native-toast-message';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { currencies } from '@/utils/constants';
import UserImage from '@/components/UserImage';

const ChargeDepositScreen = () => {
	const router = useRouter();
	const { transactionId } = useLocalSearchParams<{ transactionId: string }>();
	const [fetchLoading, setFetchLoading] = useState<boolean>(true);
	const [updateLoading, setUpdateLoading] = useState<boolean>(false);
	const [transaction, setTransaction] = useState<Transaction>();
	const [amount, setAmount] = useState(0);
	const [reason, setReason] = useState('');

	const customer = transaction?.customer;
	const maxAmount = transaction?.amount ?? 0;
	const currencySymbol = useMemo(
		() =>
			currencies.find(
				(currency) => currency.code === transaction?.currency
			)?.symbol || '₪',
		[transaction, currencies]
	);

	useEffect(() => {
		const fetchTransaction = async () => {
			if (!transactionId) {
				Toast.show({
					type: 'error',
					text1: 'Missing transaction ID',
				});
				return;
			}

			try {
				const data = await getTransactionById(transactionId);
				setTransaction(data);
				setAmount(0);
			} catch (error) {
				console.error('Error fetching transaction:', error);
				Toast.show({
					type: 'error',
					text1: 'Failed to load transaction details',
				});
			} finally {
				setFetchLoading(false);
			}
		};

		fetchTransaction();
	}, [transactionId]);

	const handleChargeDeposit = async () => {
		if (!transaction) return;

		if (amount <= 0) {
			Toast.show({
				type: 'error',
				text1: 'Invalid amount',
			});
			return;
		}
		if (amount > maxAmount) {
			Toast.show({
				type: 'error',
				text1: 'Amount exceeds maximum deposit',
			});
		}
		setUpdateLoading(true);
		try {
			await chargeDeposit(transaction._id, {
				amount,
				charged_description: reason,
			});
			Toast.show({
				type: 'success',
				text1: 'Deposit charged successfully',
				text2: `Amount: ${amount}₪`,
			});
			setAmount(0);
			setReason('');
			router.back();
		} catch (error: any) {
			console.error('Error charging deposit:', error);
			Toast.show({
				type: 'error',
				text1: 'Failed to charge deposit',
				text2: error?.message,
			});
		}
		setUpdateLoading(false);
	};

	if (fetchLoading) {
		return (
			<View className="flex-1 justify-center items-center bg-white">
				<ActivityIndicator size="large" color="#000" />
				<Text className="mt-4 text-gray-600">
					Loading transaction...
				</Text>
			</View>
		);
	}

	return (
		<SafeAreaView className="flex-1 flex flex-col bg-[#F4F5FF] px-6 justify-between">
			<View>
				<View className="flex flex-row w-full items-center justify-between mb-6 mt-8">
					<HapticButton
						onPress={() => router.back()}
						className="bg-white p-2 rounded-full shadow-md"
					>
						<Feather name="arrow-left" size={24} color="black" />
					</HapticButton>
					<Text className="text-2xl font-semibold text-gray-900">
						Charge Deposit
					</Text>
					<View className="w-12"></View>
				</View>

				<View className="bg-gray-100 bg-white rounded-2xl p-6 flex-row items-center justify-between mb-6 shadow-md">
					<View className="flex-row items-center space-x-3">
						<UserImage
							image={customer?.image}
							name={customer?.name}
							size={12}
							className="mr-2"
						/>
						<Text className="text-base font-semibold text-[#2D2A2E]">
							{customer?.name || 'Customer'}
						</Text>
					</View>
					<Text className="text-base font-semibold text-[#2D2A2E]">
						{transaction?.amount ?? '0'}
						{currencySymbol}
					</Text>
				</View>

				<Text className="text-center text-gray-500 mb-2">
					{customer?.name} has deposited{' '}
					<Text className="font-bold">
						{maxAmount}
						{currencySymbol}
					</Text>{' '}
					so this is the maximum you can charge.
				</Text>

				<PriceSelector
					title="Set Amount"
					price={amount}
					setPrice={setAmount}
					maxPrice={maxAmount}
					steps={50}
					currencySymbol={currencySymbol}
					displayPriceList={false}
				/>

				<View className="mt-4">
					<Text className="text-sm text-gray-500 mb-2">
						Charge Reason
					</Text>
					<TextInput
						className="bg-gray-100 p-5 rounded-xl text-base text-[#2D2A2E] border border-gray-300"
						value={reason}
						onChangeText={setReason}
						placeholder="Enter reason"
					/>
				</View>
			</View>

			<HapticButton
				onPress={handleChargeDeposit}
				className="rounded-full py-5 items-center shadow-md mb-8"
				style={{ backgroundColor: '#4338CA' }}
				disabled={updateLoading}
			>
				{updateLoading ? (
					<ActivityIndicator size="small" color="#FFF" />
				) : (
					<ThemedText className="font-semibold text-lg text-white">
						Charge Deposit
					</ThemedText>
				)}
			</HapticButton>
		</SafeAreaView>
	);
};

export default ChargeDepositScreen;
