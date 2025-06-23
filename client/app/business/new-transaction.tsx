import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	StyleSheet,
	ActivityIndicator,
	Switch,
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
import { useBusiness } from '@/context/BusinessContext';

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
	const [smartPrice, setSmartPrice] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(false);
	const { business } = useBusiness();

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
				const response = await createTemporaryItem(
					desc,
					date,
					price,
					smartPrice
				);
				if (!response) {
					setIsLoading(false);
					ShowToast('error', 'Internal Server Error');
					return;
				}
				setDesc('');
				setPrice(0);
				setDate(new Date());
				setSmartPrice(false);
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
				setSmartPrice(false);
			};

			return () => {
				resetForm();
			};
		}, [])
	);

	useEffect(() => {
		if (business) {
			setCurrencySymbol(
				currencies.find((c) => c.code === business.currency)?.symbol ||
					'₪'
			);
		}
	}, [business]);

	return (
		<View className="flex-1 p-6 bg-white">
			<Text className="mb-2 text-xl font-bold">New Transaction</Text>
			<Text className="mb-8 text-xl">
				Create new transaction for a customer
			</Text>

			<Text className="mb-2 text-lg font-semibold">Description</Text>
			<TextInput
				className="p-3 mb-6 text-lg bg-gray-100 border border-gray-300 rounded-lg"
				value={desc}
				onChangeText={setDesc}
			/>

			<View className="mb-6">
				<Text className="mb-2 text-lg font-semibold">
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

			<View className="flex-row items-center justify-between w-full">
				<View className="flex-1">
					<Text className="text-lg font-semibold">Smart Price</Text>
					<Text className="mb-4 text-gray-500">
						*The price will be calculated based on the customer
						profile at transaction time.
					</Text>
				</View>
				<Switch
					value={smartPrice}
					onValueChange={setSmartPrice}
					trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
					thumbColor={smartPrice ? '#ffffff' : '#f4f3f4'}
				/>
			</View>

			<PriceSelector
				title={smartPrice ? 'Minimum Price' : 'Price'}
				price={price}
				setPrice={setPrice}
				steps={50}
				currencySymbol={currencySymbol}
			/>

			<HapticButton
				className="items-center py-4 mt-5 mb-5 rounded-full shadow-lg"
				style={{ backgroundColor: '#4338CA' }}
				onPress={handleContinue}
				disabled={isLoading}
			>
				{isLoading ? (
					<ActivityIndicator size="small" color="#FFFFFF" />
				) : (
					<ThemedText
						className="text-lg font-semibold text-white"
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
