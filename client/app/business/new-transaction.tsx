import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import HapticButton from '@/components/ui/HapticButton';
import PriceSelector from '@/components/PriceSelector';
import { ThemedText } from '@/components/ui/ThemedText';
import { router, useFocusEffect } from 'expo-router';
import { createTemporaryItem } from '@/services/itemService';
import ShowToast from '@/components/ui/ShowToast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { currencies } from '@/utils/constants';

const format = {
	date: (d: Date) => d.toLocaleDateString('en-GB'),
	time: (d: Date) =>
		d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
};

const CreateTransactionScreen = () => {
	const startDate = useRef(new Date());
	const [desc, setDesc] = useState('');
	const [price, setPrice] = useState(0);
	const [currencySymbol, setCurrencySymbol] = useState('₪');
	const [date, setDate] = useState(new Date());
	const [show, setShow] = useState({ date: false, time: false });
	const [isLoading, setIsLoading] = useState(false);

	const handleDateChange = (d?: Date) => d && setDate(d);
	const handleTimeChange = (h: number, m: number) =>
		setDate(new Date(date.setHours(h, m)));

	const handleContinue = async () => {
		let error = '';
		if (!desc) {
			ShowToast('error', 'Please fill item description');
			return;
		}
		if (!price) {
			ShowToast('error', 'Price must be set');
			return;
		}
		if (date < startDate.current) {
			ShowToast('error', 'Date is not valid');
			return;
		}
		if (error) {
			ShowToast('error', error);
		} else {
			// create temporary item
			setIsLoading(true);
			try {
				const response = await createTemporaryItem(desc, date, price);
				if (!response) {
					setIsLoading(false);
					ShowToast('error', 'Internal Server Error');
					return;
				}
				setDesc('');
				setPrice(0);
				setDate(new Date());
				setShow({ date: false, time: false });
				router.push({
					pathname: '/business/QRCodeScreen',
					params: {
						id: response.item._id,
					},
				});
			} catch (error: any) {
				console.log(error.response);
				ShowToast('error', error.response.data.message);
			}
			setIsLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			const resetForm = () => {
				setDesc('');
				setPrice(0);
				setDate(new Date());
				setShow({ date: false, time: false });
			};

			return () => {
				resetForm();
			};
		}, [])
	);

	useEffect(() => {
		const fetchBusinessData = async () => {
			try {
				const data = await AsyncStorage.getItem('Business_Data');
				if (data) {
					const parsedData = JSON.parse(data);
					const currency = parsedData?.currency || 'ILS';
					setCurrencySymbol(
						currencies.find((c) => c.code === currency)?.symbol ||
							'₪'
					);
				}
			} catch (error) {
				console.error('Error fetching business data:', error);
			}
		};

		fetchBusinessData();
	}, []);

	return (
		<View className="flex-1 p-6 bg-white">
			<Text className="text-xl font-bold mb-2">New Transaction</Text>
			<Text className="text-xl mb-8">
				Create new transaction for a customer
			</Text>

			<Text className="text-lg font-semibold mb-2">Description</Text>
			<TextInput
				className="border border-gray-300 rounded-lg p-3 text-lg bg-gray-100 mb-6"
				value={desc}
				onChangeText={setDesc}
			/>

			<View className="mb-6">
				<Text className="text-lg font-semibold mb-2">
					Return time and date
				</Text>
				<View style={styles.row}>
					{['date', 'time'].map((type) => (
						<TouchableOpacity
							key={type}
							style={styles.input}
							onPress={() =>
								setShow((prev) => ({ ...prev, [type]: true }))
							}
						>
							<Text>{format[type as 'date' | 'time'](date)}</Text>
						</TouchableOpacity>
					))}
				</View>

				<DatePickerModal
					locale="en-GB"
					mode="single"
					visible={show.date}
					onDismiss={() =>
						setShow((prev) => ({ ...prev, date: false }))
					}
					date={date}
					onConfirm={({ date }) => {
						handleDateChange(date);
						setShow((prev) => ({ ...prev, date: false }));
					}}
				/>

				<TimePickerModal
					visible={show.time}
					onDismiss={() =>
						setShow((prev) => ({ ...prev, time: false }))
					}
					onConfirm={({ hours, minutes }) => {
						handleTimeChange(hours, minutes);
						setShow((prev) => ({ ...prev, time: false }));
					}}
					hours={date.getHours()}
					minutes={date.getMinutes()}
				/>
			</View>

			<PriceSelector
				title="Set Price"
				price={price}
				setPrice={setPrice}
				steps={50}
				currencySymbol={currencySymbol}
			/>

			<HapticButton
				className="rounded-full py-4 items-center mb-5 shadow-lg mt-5"
				style={{ backgroundColor: '#4338CA' }}
				onPress={handleContinue}
				disabled={isLoading}
			>
				{isLoading ? (
					<ActivityIndicator size="small" color="#FFFFFF" />
				) : (
					<ThemedText
						className="text-white font-semibold text-lg"
						lightColor="#fff"
					>
						Continue
					</ThemedText>
				)}
			</HapticButton>
		</View>
	);
};

const styles = StyleSheet.create({
	row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 8,
		padding: 12,
		backgroundColor: '#f3f4f6',
	},
});

export default CreateTransactionScreen;
