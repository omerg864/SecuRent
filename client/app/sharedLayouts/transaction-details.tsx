'use client';

import { useCallback, useEffect, useState } from 'react';
import {
	View,
	TouchableOpacity,
	StatusBar,
	SafeAreaView,
	ScrollView,
	ActivityIndicator,
	Text,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
	useRouter,
	useLocalSearchParams,
	useFocusEffect,
	RelativePathString,
} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import HapticButton from '@/components/ui/HapticButton';
import {
	getTransactionById,
	closeTransaction,
	chargeDeposit,
} from '@/services/transactionService';
import { Transaction } from '@/services/interfaceService';
import UserImage from '@/components/UserImage';

export default function TransactionDetails() {
	const router = useRouter();
	const { id, from } = useLocalSearchParams();

	const [transaction, setTransaction] = useState<Transaction | null>(null);
	const [isOpen, setIsOpen] = useState(true);
	const [loading, setLoading] = useState(true);
	const [accountType, setAccountType] = useState<string | null>(null);

	const userImage =
		accountType === 'business'
			? transaction?.customer?.image
			: transaction?.business?.image;
	const userName =
		accountType === 'business'
			? transaction?.customer?.name
			: transaction?.business?.name;

	useFocusEffect(
		useCallback(() => {
			const fetchData = async () => {
				try {
					const type = await AsyncStorage.getItem(
						'current_account_type'
					);
					setAccountType(type);

					if (!id || typeof id !== 'string') {
						Toast.show({
							type: 'error',
							text1: 'Missing transaction ID',
						});
						return;
					}

					const data = await getTransactionById(id);
					setTransaction(data);
					setIsOpen(data.status === 'open');
				} catch (error: any) {
					Toast.show({
						type: 'error',
						text1: 'Failed to load transaction',
						text2: error.message || 'Please try again later',
					});
				} finally {
					setLoading(false);
				}
			};

			fetchData();

			// Optional cleanup if you want to reset state
			return () => {
				setTransaction(null);
				setIsOpen(true);
				setLoading(true);
				setAccountType(null);
			};
		}, [id])
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const type = await AsyncStorage.getItem('current_account_type');
				setAccountType(type);

				if (!id || typeof id !== 'string') {
					Toast.show({
						type: 'error',
						text1: 'Missing transaction ID',
					});
					return;
				}

				const data = await getTransactionById(id);
				setTransaction(data);
				setIsOpen(data.status === 'open');
			} catch (error: any) {
				Toast.show({
					type: 'error',
					text1: 'Failed to load transaction',
					text2: error.message || 'Please try again later',
				});
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id]);

	const handleCloseTransaction = async () => {
		try {
			if (!id || typeof id !== 'string') return;
			setLoading(true);
			const updated = await closeTransaction(id);
			setTransaction(updated);
			setIsOpen(false);
			Toast.show({
				type: 'success',
				text1: 'Transaction closed successfully',
			});
		} catch (error: any) {
			Toast.show({
				type: 'error',
				text1: 'Failed to close transaction',
				text2: error.message || 'Try again',
			});
		}
		setLoading(false);
	};

	const handleChargeDeposit = () => {
		router.push({
			pathname: '/business/charge-deposit',
			params: { transactionId: id },
		});
	};

	if (loading) {
		return (
			<View className="flex-1 justify-center items-center bg-white">
				<ActivityIndicator size="large" color="#000" />
				<Text className="mt-4 text-gray-600">
					Loading transaction...
				</Text>
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

			{/* Floating Back Button + Title */}
			<View className="absolute top-20 left-5 z-10">
				<HapticButton
					onPress={() =>
						router.replace({ pathname: from as RelativePathString })
					}
					className="bg-white p-2 rounded-full shadow-md"
				>
					<Feather name="arrow-left" size={24} color="black" />
				</HapticButton>
			</View>

			<View className="mt-20 mb-6 items-center">
				<Text className="text-2xl font-semibold text-gray-900">
					Transaction Details
				</Text>
			</View>

			<ScrollView className="flex-1 px-6">
				<View className="items-center mb-8 mt-2">
					<UserImage
						image={userImage}
						name={userName}
						size={16}
						className="mb-2"
					/>
					<Text className="text-lg font-medium text-black">
						{transaction.customer?.name ||
							transaction.business?.name}
					</Text>
				</View>

				<View className="mb-6 bg-gray-50 rounded-lg py-4">
					<Row
						label="Start Date"
						value={new Date(
							transaction.createdAt
						).toLocaleDateString()}
					/>
					<Row
						label="Start Time"
						value={new Date(
							transaction.createdAt
						).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
						})}
					/>
				</View>

				{!isOpen && (
					<View className="mb-6 bg-gray-50 rounded-lg py-4">
						<Row
							label="End Date"
							value={
								transaction.return_date
									? new Date(
											transaction.return_date
									  ).toLocaleDateString()
									: '-'
							}
						/>
						<Row
							label="End Time"
							value={
								transaction.return_date
									? new Date(
											transaction.return_date
									  ).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
									  })
									: '-'
							}
						/>
					</View>
				)}

				<View className="mb-6 bg-gray-50 rounded-lg py-4">
					<Row
						label="Description"
						value={transaction.description || '-'}
					/>
					<Row
						label="Amount"
						value={`${transaction.amount} ${transaction.currency}`}
					/>
				</View>

				<View className="flex-row bg-gray-50">
					<View className="flex-1 p-4">
						<Text className="text-sm text-gray-600">Status</Text>
					</View>
					<View className="flex-1 p-4 items-end">
						<Text
							className={`text-sm font-medium ${
								isOpen ? 'text-green-700' : 'text-gray-700'
							}`}
						>
							{transaction.status}
						</Text>
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

				{accountType === 'customer' && (
					<Text className="text-xs text-center text-gray-400 mt-6">
						* This transaction is read-only for customers
					</Text>
				)}
			</ScrollView>

			{isOpen && accountType === 'business' && (
				<View className="absolute bottom-4 left-0 right-0 px-6 pb-6 bg-white">
					<HapticButton
						className="bg-red-500 rounded-full py-4 items-center mb-3"
						onPress={handleChargeDeposit}
					>
						<Text className="text-white font-semibold text-lg">
							Charge Deposit
						</Text>
					</HapticButton>

					<HapticButton
						className="bg-blue-600 rounded-full py-4 items-center"
						onPress={handleCloseTransaction}
					>
						<Text className="text-white font-semibold text-lg">
							Close Transaction
						</Text>
					</HapticButton>
				</View>
			)}
		</SafeAreaView>
	);
}

const Row = ({ label, value }: { label: string; value: string }) => (
	<View className="flex-row">
		<View className="flex-1 p-4">
			<Text className="text-sm text-gray-600">{label}</Text>
		</View>
		<View className="flex-1 p-4 items-end">
			<Text className="text-sm font-medium text-black">{value}</Text>
		</View>
	</View>
);
