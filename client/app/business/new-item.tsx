import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import ProfileImageInput from '../../components/ProfileImageInput'; // adjust path as needed
import { FileObject } from '@/types/business';
import { Picker } from '@react-native-picker/picker';
import PricePicker from '@/components/PricePicker';
import Toast from 'react-native-toast-message';
import { ThemedText } from '@/components/ui/ThemedText';
import HapticButton from '@/components/ui/HapticButton';
import { createBusinessItem } from '@/services/itemService';
import { useRouter } from 'expo-router';
import { getBusinessCurrencySymbol } from '@/utils/functions';

export default function newItem() {
	const [desc, setDesc] = useState('');
	const [price, setPrice] = useState(0);
	const [file, setFile] = useState<FileObject | null>(null);
	const [duration, setDuration] = useState('');
	const [timeUnit, setTimeUnit] = useState('days');
	const [durationError, setDurationError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [currency, setCurrency] = useState('ILS');

	const timeUnits = ['minutes', 'hours', 'days'];

	const router = useRouter();

	const handleSubmit = async () => {
		if (durationError || !duration) {
			Toast.show({
				type: 'error',
				text1: 'Invalid duration',
				text2: durationError || 'Please fill in duration',
			});
			return;
		}
		if (!desc) {
			Toast.show({
				type: 'error',
				text1: 'Invalid description',
				text2: 'Please fill in description',
			});
			return;
		}
		if (!price) {
			Toast.show({
				type: 'error',
				text1: 'Invalid price',
				text2: 'Please fill in price',
			});
			return;
		}

		setIsLoading(true);
		try {
			const response = await createBusinessItem(
				desc,
				price,
				parseInt(duration),
				timeUnit,
				file
			);
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
			setFile(null);
			setDuration('');
			setTimeUnit('days');
			setDurationError('');
			Toast.show({
				type: 'success',
				text1: 'Item created successfully',
			});
			router.replace({
				pathname: '/business/business-home',
			});
		} catch (error: any) {
			Toast.show({
				type: 'error',
				text1: error.response.data.message,
			});
		}
		setIsLoading(false);
	};

	const onDurationChange = (val: string) => {
		if (val === '') {
			setDuration('');
			setDurationError('');
			return;
		}
		const num = parseInt(val);
		if (isNaN(num)) {
			setDurationError('Duration must be a number');
			return;
		}

		switch (timeUnit) {
			case 'days':
				if (num > 0 && num <= 30) {
					setDuration(val);
					setDurationError('');
				} else {
					setDurationError(
						`Duration ${
							timeUnit.charAt(0).toUpperCase() + timeUnit.slice(1)
						} must be between 1 and 30`
					);
				}
				break;
			case 'hours':
				if (num > 0 && num <= 24) {
					setDuration(val);
					setDurationError('');
				} else {
					setDurationError(
						`Duration ${
							timeUnit.charAt(0).toUpperCase() + timeUnit.slice(1)
						} must be between 1 and 24`
					);
				}
				break;
			case 'minutes':
				if (num > 0 && num <= 60) {
					setDuration(val);
					setDurationError('');
				} else {
					setDurationError(
						`Duration ${
							timeUnit.charAt(0).toUpperCase() + timeUnit.slice(1)
						} must be between 1 and 60`
					);
				}
				break;
		}
	};

	useEffect(() => {
		const getSymbol = async () => {
			const symbol = await getBusinessCurrencySymbol();
			setCurrency(symbol);
		};

		getSymbol();
	}, []);

	return (
		<ScrollView className="flex-1 p-4 bg-white">
			<Text className="text-xl font-bold mb-2">New Item</Text>
			<Text className="text-xl mb-8">
				Create a new item for your business
			</Text>

			{/* Image Upload */}
			<ProfileImageInput
				file={file}
				containerClassName="mb-6"
				themeText={false}
				labelClassName="text-black"
				label={`Item Image`}
				setFile={setFile}
			/>

			<Text className="text-lg font-semibold mb-2">Description</Text>
			<TextInput
				className="border border-gray-300 rounded-lg p-3 text-lg bg-gray-100 mb-6"
				value={desc}
				onChangeText={setDesc}
			/>

			{/* Price Section */}
			<PricePicker
				label="Price"
				price={price}
				setPrice={setPrice}
				currency={currency}
			/>

			{/* Duration */}
			<View className="mt-8">
				<Text className="text-lg font-semibold mb-3">Duration</Text>

				<View className="flex-row gap-4 items-center">
					<View className="flex-1">
						<TextInput
							className={`border rounded-xl p-3 text-lg text-center bg-gray-100 ${
								durationError
									? 'border-red-500'
									: 'border-gray-300'
							}`}
							keyboardType="numeric"
							placeholder=""
							value={duration}
							onChangeText={onDurationChange}
						/>
					</View>

					<View className="flex-1 border border-gray-300 rounded-xl bg-white overflow-hidden">
						<Picker
							selectedValue={timeUnit}
							onValueChange={(itemValue) =>
								setTimeUnit(itemValue)
							}
						>
							{timeUnits.map((unit) => (
								<Picker.Item
									label={
										unit.charAt(0).toUpperCase() +
										unit.slice(1)
									}
									value={unit}
									key={unit}
								/>
							))}
						</Picker>
					</View>
				</View>

				{durationError ? (
					<Text className="text-red-500 mt-2 ml-1 text-sm">
						{durationError}
					</Text>
				) : null}
			</View>
			{/* Submit Button */}
			<HapticButton
				className="bg-white rounded-full py-4 items-center mb-5 shadow-lg mt-5"
				style={{ backgroundColor: '#4338CA' }}
				onPress={handleSubmit}
				disabled={isLoading}
			>
				{isLoading ? (
					<ActivityIndicator size="small" color="#FFFFFF" />
				) : (
					<ThemedText
						className="text-white font-semibold text-lg"
						lightColor="#fff"
					>
						Create Item
					</ThemedText>
				)}
			</HapticButton>
		</ScrollView>
	);
}
