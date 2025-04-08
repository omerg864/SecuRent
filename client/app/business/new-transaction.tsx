import React, { useRef, useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';
import { ca, DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import HapticButton from '@/components/ui/HapticButton';
import { ThemedText } from '@/components/ui/ThemedText';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { createItem } from '@/services/itemService';
import { Item } from '@/services/interfaceService';

const amounts = [100, 500, 1000];
const format = {
	date: (d: Date) => d.toLocaleDateString('en-GB'),
	time: (d: Date) =>
		d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
	currency: (n: number) => n.toLocaleString() + '₪',
};

export default () => {
	const startDate = useRef<Date>(new Date());

	const [desc, setDesc] = useState('');
	const [price, setPrice] = useState(0);
	const [date, setDate] = useState(new Date());
	const [show, setShow] = useState({ date: false, time: false });
	const [editAmount, setEditAmount] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const updateDate = (d?: Date) => d && setDate(d);
	const updateTime = (h: number, m: number) =>
		setDate(new Date(date.setHours(h, m)));

	const handleContinueButton = async () => {
		let error = '';
		if (!desc) {
			error = 'Please fill item description';
			Toast.show({ type: 'error', text1: `${error}` });
			return;
		}
		if (!price) {
			error = 'Price must be set';
			Toast.show({ type: 'error', text1: `${error}` });
			return;
		}
		if (date < startDate.current) {
			error = 'Date is not valid';
			Toast.show({ type: 'error', text1: `${error}` });
			return;
		}
		if (error) {
			Toast.show({ type: 'error', text1: `${error}` });
		} else {
			// create temporary item
			setIsLoading(true);
			try {
				const response = await createItem(desc, date, price, true, 0);
				if (!response) {
					setIsLoading(false);
					Toast.show({
						type: 'error',
						text1: 'Internal Server Error',
					});
					return;
				}
				setDesc('');
				setPrice(0);
				setDate(new Date());
				setShow({ date: false, time: false });
				setEditAmount(false);
				router.push({
					pathname: '/business/QRCodeScreen',
					params: {
						id: response.item._id,
					},
				});
			} catch (error: any) {
				console.log(error.response);
				Toast.show({
					type: 'error',
					text1: error.response.data.message,
				});
			}
			setIsLoading(false);
		}
	};

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
					<TouchableOpacity
						style={styles.input}
						onPress={() => setShow({ ...show, date: true })}
					>
						<Text>{format.date(date)}</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.input}
						onPress={() => setShow({ ...show, time: true })}
					>
						<Text>{format.time(date)}</Text>
					</TouchableOpacity>
				</View>

				<DatePickerModal
					locale="en-GB"
					mode="single"
					visible={show.date}
					onDismiss={() => setShow({ ...show, date: false })}
					date={date}
					onConfirm={({ date }) => {
						updateDate(date);
						setShow({ ...show, date: false });
					}}
				/>

				<TimePickerModal
					visible={show.time}
					onDismiss={() => setShow({ ...show, time: false })}
					onConfirm={({ hours, minutes }) => {
						updateTime(hours, minutes);
						setShow({ ...show, time: false });
					}}
					hours={date.getHours()}
					minutes={date.getMinutes()}
				/>
			</View>

			<View className="mb-8">
				<Text className="text-lg font-semibold mb-3">Set Price</Text>
				<View className="flex-row items-center mb-4">
					<AmountBtn
						onPress={() => setPrice(Math.max(0, price - 50))}
					>
						-
					</AmountBtn>
					<TouchableOpacity
						className="flex-1 items-center"
						onPress={() => setEditAmount(true)}
					>
						{editAmount ? (
							<TextInput
								className="text-2xl font-medium text-center"
								keyboardType="numeric"
								value={price.toString()}
								onChangeText={(t) => setPrice(parseInt(t) || 0)}
								onBlur={() => setEditAmount(false)}
								autoFocus
							/>
						) : (
							<Text className="text-2xl font-medium">
								{format.currency(price)}
							</Text>
						)}
					</TouchableOpacity>
					<AmountBtn onPress={() => setPrice(price + 50)}>
						+
					</AmountBtn>
				</View>

				<View className="flex-row justify-between">
					{amounts.map((a) => (
						<TouchableOpacity
							key={a}
							className={`border-2 rounded-lg py-4 flex-1 mx-1 items-center ${
								price === a
									? 'bg-indigo-600 border-indigo-600'
									: 'border-gray-300 bg-white'
							}`}
							onPress={() => setPrice(a)}
						>
							<Text
								className={`text-lg ${
									price === a ? 'text-white' : 'text-gray-700'
								}`}
							>
								{format.currency(a)}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>

			<HapticButton
				className="bg-white rounded-full py-4 items-center mb-5 shadow-lg mt-5"
				style={{ backgroundColor: '#4338CA' }}
				onPress={handleContinueButton}
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

const AmountBtn = ({ onPress, children }: any) => (
	<TouchableOpacity
		className="border-2 border-gray-300 rounded-lg w-12 h-12 items-center justify-center"
		onPress={onPress}
	>
		<Text className="text-2xl">{children}</Text>
	</TouchableOpacity>
);

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
