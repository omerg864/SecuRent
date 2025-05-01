'use client';
import { View, TouchableOpacity, FlatList, ListRenderItem } from 'react-native';
import HapticButton from '@/components/ui/HapticButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Transaction } from '@/services/interfaceService';
import { getBusinessTransactions } from '@/services/transactionService';
import { useWebSocketContext } from '@/context/WebSocketContext';
import { currencies } from '@/utils/constants';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const PAGE_SIZE = 5;

const BusinessHomePage = () => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const router = useRouter();

	const { lastMessage } = useWebSocketContext();

	const handleNewTransaction = () => {
		router.push('/business/new-transaction');
	};
	const loadTransaction = async (pageToLoad = 1, reset = false) => {
		if (isLoading) return;
		if (pageToLoad > 1 && !hasMore) return;

		setIsLoading(true);

		try {
			const data = await getBusinessTransactions();
			const openTransactions = data.transactions.filter(
				(t) => t.status === 'open'
			);
			const paginated = openTransactions.slice(
				(pageToLoad - 1) * PAGE_SIZE,
				pageToLoad * PAGE_SIZE
			);

			// Reset transactions or append based on the reset flag
			if (reset) {
				setTransactions(paginated);
			} else {
				// Use a Map to ensure uniqueness by _id
				const uniqueTransactions = new Map();

				// Add existing transactions
				transactions.forEach((t) => uniqueTransactions.set(t._id, t));

				// Add new transactions, overwriting if they already exist
				paginated.forEach((t) => uniqueTransactions.set(t._id, t));

				// Convert back to array
				setTransactions(Array.from(uniqueTransactions.values()));
			}

			setHasMore(paginated.length === PAGE_SIZE);
			setPage(pageToLoad + 1);
		} catch (error) {
			console.error('Error loading transactions:', error);
		} finally {
			setIsLoading(false);
		}
	};

	// Update the useFocusEffect to use the reset parameter
	useFocusEffect(
		useCallback(() => {
			loadTransaction(1, true); // true means reset the list

			return () => {
				setTransactions([]);
				setPage(1);
				setHasMore(true);
			};
		}, [])
	);

	// Update the WebSocket effect to handle new transactions better
	useEffect(() => {
		if (lastMessage && lastMessage.data) {
			try {
				const messageObject = JSON.parse(lastMessage.data);
				if (messageObject.type !== 'newTransaction') return;

				loadTransaction(1, true);
			} catch (error) {
				console.error('Error processing WebSocket message:', error);
			}
		}
	}, [lastMessage]);

	const renderTransaction: ListRenderItem<Transaction> = ({ item }) => (
		<TouchableOpacity
			className="flex-row items-center py-3 px-4 border-b border-gray-200"
			onPress={() =>
				router.push({
					pathname: '/business/transaction-details',
					params: { id: item._id, from: '/business/business-home' },
				})
			}
		>
			<View className="flex-1">
				<ThemedText
					style={{ color: 'black' }}
					className="text-base font-medium mb-1"
				>
					{item.customer?.name}
				</ThemedText>
				<ThemedText style={{ color: 'grey' }} className="text-sm">
					{item.description}
				</ThemedText>
			</View>
			<ThemedText
				style={{ color: 'black' }}
				className="text-base font-semibold"
			>
				{item.amount}{' '}
				{currencies.find((currency) => currency.code === item?.currency)
					?.symbol || '₪'}
			</ThemedText>
		</TouchableOpacity>
	);

	return (
		<View className="flex-1 bg-gray-100 px-4">
			<HapticButton
				className="bg-white rounded-full py-4 items-center mb-5 shadow-lg mt-5"
				style={{ backgroundColor: '#4338CA' }}
				onPress={handleNewTransaction}
			>
				<ThemedText className="text-white font-semibold text-lg">
					New Transaction
				</ThemedText>
			</HapticButton>

			<View
				className="bg-white rounded-xl shadow-lg p-2"
				style={{ height: 280 }} // fixed height ensures scrolling within this box
			>
				<View className="flex-row justify-between items-center py-4 px-2 border-b border-gray-200">
					<ThemedText
						style={{ color: 'black' }}
						className="text-lg font-semibold"
					>
						Active Transactions
					</ThemedText>
					<Ionicons name="chevron-forward" size={20} color="#666" />
				</View>

				<FlatList
					style={{ flex: 1 }}
					data={transactions}
					renderItem={renderTransaction}
					keyExtractor={(item) => item._id}
					onEndReached={() => {
						console.log('Reached end!');
						loadTransaction(page);
					}}
					onEndReachedThreshold={0.5}
					scrollEnabled={true}
					showsVerticalScrollIndicator={true}
					contentContainerStyle={{ paddingBottom: 10, flexGrow: 1 }} // ensure content takes space even when empty
					ListEmptyComponent={() =>
						!isLoading && (
							<View className="flex-1 justify-center items-center mt-4">
								<ThemedText className="text-gray-500 text-base text-center">
									No active transactions
								</ThemedText>
							</View>
						)
					}
					ListFooterComponent={() =>
						isLoading && (
							<View
								className="py-4 justify-center items-center align-middle"
								style={{ height: 200 }}
							>
								<LoadingSpinner />
							</View>
						)
					}
				/>
			</View>
		</View>
	);
};

export default BusinessHomePage;
