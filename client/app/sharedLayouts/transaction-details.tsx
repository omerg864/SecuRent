'use client';

import { useCallback, useEffect, useState } from 'react';
import { View, StatusBar, SafeAreaView, ScrollView, Text } from 'react-native';
import {
	useRouter,
	useLocalSearchParams,
	useFocusEffect,
	RelativePathString,
} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HapticButton from '@/components/ui/HapticButton';
import {
	getTransactionById,
	closeTransaction,
} from '@/services/transactionService';
import { Transaction } from '@/types/transaction';
import UserImage from '@/components/UserImage';
import FloatingBackArrowButton from '@/components/ui/FloatingBackArrowButton';
import { formatCurrencySymbol } from '@/utils/functions';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ShowToast from '@/components/ui/ShowToast';
import { CURRENT_ACCOUNT_TYPE } from '@/utils/asyncStorageConstants';
import ConfirmEmailLink from '@/components/ConfirmEmailLink';
import LateWarning from '@/components/LateWarning';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionDetails() {
	const router = useRouter();
	const { id, from } = useLocalSearchParams();

	const [transaction, setTransaction] = useState<Transaction | null>(null);
	const [isOpen, setIsOpen] = useState(true);
	const [loading, setLoading] = useState(true);
	const [accountType, setAccountType] = useState<string | null>(null);
	const [hasReviewed, setHasReviewed] = useState(false);

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
						CURRENT_ACCOUNT_TYPE
					);
					setAccountType(type);

					if (!id || typeof id !== 'string') {
						ShowToast('error', 'Missing transaction ID');

						return;
					}

					const data = await getTransactionById(id);
					setTransaction(data);
					setHasReviewed(!!data.review?.content);
					setIsOpen(data.status === 'open');
				} catch (error: any) {
					ShowToast(
						'error',
						'Failed to load transaction',
						error.message || 'Please try again later'
					);
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

	const handleAddReview = () => {
		router.push({
			pathname: '/customer/add-review',
			params: {
				businessName: transaction?.business?.name,
				businessImage: transaction?.business?.image,
				transactionId: id,
				from: `/customer/transaction-details?id=${id}`,
			},
		});
	};

	const handleGoToBusinessProfile = () => {
		router.push({
			pathname: '/customer/BusinessProfileScreen',
			params: {
				id: transaction?.business?._id,
				from: `/customer/transaction-details?id=${id}`,
			},
		});
	};

	const handleWatchMyReview = () => {
		router.push({
			pathname: '/customer/display-review',
			params: {
				from: `/customer/transaction-details?id=${id}`,
				userName: transaction?.customer?.name,
				userImage: transaction?.customer?.image,
				reviewText: transaction?.review?.content,
				reviewImages: transaction?.review?.image
					? JSON.stringify(transaction.review.image)
					: JSON.stringify([]),
				businessName: transaction?.business?.name,
				businessImage: transaction?.business?.image,
				createdAt: transaction?.review?.createdAt?.toString(),
			},
		});
	};

	const handleCloseTransaction = async () => {
		try {
			if (!id || typeof id !== 'string') return;
			setLoading(true);
			const updated = await closeTransaction(id);
			setTransaction(updated);
			setIsOpen(false);
			ShowToast('success', 'Transaction closed successfully');
		} catch (error: any) {
			console.error('Error closing transaction: ', error.response.data);
			ShowToast(
				'error',
				'Failed to close transaction',
				error.message || 'Try again'
			);
		}
		setLoading(false);
	};

	const handleChargeDeposit = () => {
		router.push({
			pathname: '/business/charge-deposit',
			params: { transactionId: id },
		});
	};

	if (loading) return <LoadingSpinner label="loading transaction..." />;

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
		<SafeAreaView className="flex-1 bg-gray-100">
			<StatusBar barStyle="dark-content" />

			<FloatingBackArrowButton
				from={
					typeof from === 'string'
						? (from as RelativePathString)
						: (`/${
								accountType === 'personal'
									? 'customer'
									: 'business'
						  }/transactions` as RelativePathString)
				}
			/>
			{accountType === 'personal' &&  transaction?.status === 'open' && (
				<View className="absolute top-20 right-5 z-10">
					<HapticButton
						onPress={() =>
							router.push({
								pathname: '/customer/QRCodeScreen',
								params: { id: transaction._id },
							})
						}
						className="bg-white p-2 rounded-full shadow-md"
					>
						<Ionicons
							name="qr-code-outline"
							size={24}
							color="black"
						/>
					</HapticButton>
				</View>
			)}
			<View className="mt-20 mb-6 items-center">
				<Text className="text-2xl font-semibold text-gray-900">
					Transaction Details
				</Text>
			</View>

			<ScrollView
				className="flex-1 px-6"
				contentContainerStyle={{ paddingBottom: 130 }}
			>
				<View className="items-center mb-8 mt-2">
					<UserImage
						image={userImage}
						name={userName}
						size={16}
						className="mb-2"
					/>
					<Text className="text-lg font-medium text-black mb-2">
						{userName}
					</Text>

					{accountType === 'business' &&
						transaction.customer?.email && (
							<ConfirmEmailLink
								email={transaction.customer.email}
								recipientName={transaction.customer.name}
								businessName={transaction.business?.name}
							/>
						)}

					{accountType === 'personal' && (
						<HapticButton
							onPress={handleGoToBusinessProfile}
							className="px-4 py-1 rounded-full bg-blue-500 self-center"
						>
							<Text className="text-white text-sm font-medium">
								View Business Profile
							</Text>
						</HapticButton>
					)}

					<LateWarning
						returnDate={transaction.return_date}
						status={transaction.status}
					/>
				</View>

				<View className="mb-6 bg-gray-50 rounded-lg py-4">
					<Row
						label="Description"
						value={transaction.description || '-'}
					/>
					<Row
						label="Deposit Amount"
						value={`${transaction.amount} ${formatCurrencySymbol(
							transaction.currency
						)}`}
					/>
				</View>

				<View className="mb-6 bg-gray-50 rounded-lg py-4">
					<Row
						label="Start Date"
						value={new Date(
							transaction.createdAt
						).toLocaleDateString('en-GB')}
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

				<View className="mb-6 bg-gray-50 rounded-lg py-4">
					<Row
						label="Planned End Date"
						value={
							transaction.return_date
								? new Date(
										transaction.return_date
								  ).toLocaleDateString()
								: '-'
						}
					/>
					<Row
						label="Planned End Time"
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

				{!isOpen && (
					<View className="mb-6 bg-gray-50 rounded-lg py-4">
						<Row
							label="Actual End Date"
							value={
								transaction.closed_at
									? new Date(
											transaction.closed_at
									  ).toLocaleDateString('en-GB')
									: '-'
							}
						/>
						<Row
							label="Actual End Time"
							value={
								transaction.closed_at
									? new Date(
											transaction.closed_at
									  ).toLocaleTimeString('en-GB', {
											hour: '2-digit',
											minute: '2-digit',
									  })
									: '-'
							}
						/>
					</View>
				)}

				<View className="mb-4 bg-gray-50 rounded-lg py-4">
					<Row
						label="Status"
						value={
							transaction.status.charAt(0).toUpperCase() +
							transaction.status.slice(1)
						}
						valueClass={
							transaction.status === 'open'
								? 'text-green-700'
								: transaction.status === 'closed'
								? 'text-gray-700'
								: 'text-red-700'
						}
					/>

					{/* Charge amount */}
					{transaction.status !== 'open' && (
						<Row
							label="Charge amount"
							value={
								typeof transaction.charged === 'number'
									? `${transaction.charged} ${transaction.currency}`
									: 'Deposit was not charged'
							}
						/>
					)}
				</View>

				{transaction.charged_description && (
					<View className="mb-6 bg-gray-50 rounded-lg py-4 mt-4">
						<Row
							label="Charged Reason"
							value={transaction.charged_description}
						/>
					</View>
				)}

				{accountType === 'personal' && (
					<Text className="text-xs text-center text-gray-400 mt-6">
						* This transaction is read-only for customers
					</Text>
				)}
			</ScrollView>

			{!isOpen && accountType === 'personal' && (
				<View className="absolute bottom-4 left-0 right-0 px-6 pb-6 bg-gray-100">
					<HapticButton
						className={`rounded-full py-4 items-center mb-3 ${
							hasReviewed ? 'bg-yellow-500' : 'bg-green-500'
						}`}
						onPress={
							hasReviewed ? handleWatchMyReview : handleAddReview
						}
					>
						<Text className="text-white font-semibold text-lg">
							{hasReviewed ? 'Watch my review' : 'Add Review'}
						</Text>
					</HapticButton>
				</View>
			)}

			{isOpen && accountType === 'business' && (
				<View className="absolute bottom-4 left-0 right-0 px-6 pb-6 bg-gray-100 pt-2">
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

const Row = ({
	label,
	value,
	valueClass = '',
}: {
	label: string;
	value: string;
	valueClass?: string;
}) => (
	<View className="flex-row">
		<View className="flex-1 p-4">
			<Text className="text-sm text-gray-800">{label}</Text>
		</View>
		<View className="flex-1 p-4 items-end">
			<Text className={`text-sm font-medium text-black ${valueClass}`}>
				{value}
			</Text>
		</View>
	</View>
);
