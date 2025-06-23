import React, { useEffect, useState } from 'react';
import { Text, ScrollView, ActivityIndicator } from 'react-native';
import { FileObject } from '@/types/business';
import Toast from 'react-native-toast-message';
import { ThemedText } from '@/components/ui/ThemedText';
import HapticButton from '@/components/ui/HapticButton';
import { createBusinessItem } from '@/services/itemService';
import { useRouter } from 'expo-router';
import ItemForm from '@/components/forms/ItemForm';
import { useBusiness } from '@/context/BusinessContext';

export default function newItem() {
	const [desc, setDesc] = useState('');
	const [price, setPrice] = useState(0);
	const [file, setFile] = useState<FileObject | null>(null);
	const [duration, setDuration] = useState('');
	const [timeUnit, setTimeUnit] = useState('days');
	const [smartPrice, setSmartPrice] = useState<boolean>(false);
	const [durationError, setDurationError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [currency, setCurrency] = useState('ILS');
	const { business } = useBusiness();

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
				smartPrice,
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
		setCurrency(business?.currency || 'ILS');
	}, [business]);

	return (
		<ScrollView className="flex-1 p-4 bg-white">
			<Text className="text-xl text-bold mb-8">
				Create a new item for your business
			</Text>
			<ItemForm
				desc={desc}
				setDesc={setDesc}
				price={price}
				setPrice={setPrice}
				file={file}
				setFile={setFile}
				smartPrice={smartPrice}
				setSmartPrice={setSmartPrice}
				duration={duration}
				timeUnit={timeUnit}
				setTimeUnit={setTimeUnit}
				durationError={durationError}
				onDurationChange={onDurationChange}
				currency={currency}
			/>
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
