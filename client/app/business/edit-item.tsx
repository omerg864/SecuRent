import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { FileObject } from '@/types/business';
import { ThemedText } from '@/components/ui/ThemedText';
import { getItemByIdForBusiness, updateItemById } from '@/services/itemService';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Item } from '@/services/interfaceService';
import HapticButton from '@/components/ui/HapticButton';
import ItemForm from '@/components/forms/ItemForm';
import ShowToast from '@/components/ui/ShowToast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useBusiness } from '@/context/BusinessContext';

export default function EditItem() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();

	const [desc, setDesc] = useState('');
	const [price, setPrice] = useState(0);
	const [file, setFile] = useState<FileObject | null>(null);
	const [duration, setDuration] = useState('');
	const [timeUnit, setTimeUnit] = useState('days');
	const [durationError, setDurationError] = useState('');
	const [currency, setCurrency] = useState('ILS');
	const [originalImageExists, setOriginalImageExists] = useState(false);
	const [itemNotFound, setItemNotFound] = useState(false);

	const [loadingState, setLoadingState] = useState<'init' | 'edit' | null>(
		'init'
	);
	const { business } = useBusiness();

	useEffect(() => {
		const fetchItem = async () => {
			setLoadingState('init');
			setDesc('');
			setPrice(0);
			setDuration('');
			setFile(null);
			setItemNotFound(false);
			setDurationError('');
			try {
				const response = await getItemByIdForBusiness(id);
				const item = response.item as Item;

				if (!item) {
					setItemNotFound(true);
					return;
				}

				setDesc(item.description);
				setPrice(item.price);
				setDuration(String(item.duration || ''));
				setTimeUnit(item.timeUnit || 'days');

				if (item.image) {
					setFile({
						uri: item.image,
						name: 'image.jpg',
						type: 'image/jpeg',
					});
					setOriginalImageExists(true);
				} else {
					setFile(null);
					setOriginalImageExists(false);
				}
			} catch (error: any) {
				const status = error?.response?.status;
				if (status === 404) {
					setItemNotFound(true);
				} else {
					ShowToast('error', 'Error fetching item');
					router.back();
				}
			} finally {
				setLoadingState(null);
			}
		};

		setCurrency(business?.currency || 'ILS');
		fetchItem();
	}, [id]);

	const handleSubmit = async () => {
		if (durationError || !duration || !desc || !price) {
			ShowToast('error', 'Please fill all required fields correctly');
			return;
		}

		setLoadingState('edit');
		try {
			const formData = new FormData();

			formData.append('description', desc);
			formData.append('price', String(price));

			const parsedDuration = parseInt(duration);
			if (isNaN(parsedDuration)) {
				ShowToast('error', 'Invalid duration');
				setLoadingState(null);
				return;
			}

			formData.append('duration', String(parsedDuration));
			formData.append('timeUnit', timeUnit);

			if (file) {
				if (file.uri.startsWith('file://')) {
					formData.append('image', {
						uri: file.uri,
						name: file.name,
						type: file.type,
					} as any);
				}
			} else if (!file && originalImageExists) {
				formData.append('imageDeleteFlag', 'true');
			}

			const response = await updateItemById(
				id,
				desc,
				price,
				parsedDuration,
				timeUnit,
				file,
				formData
			);

			if (!response) {
				ShowToast('error', 'Internal Server Error');
				setLoadingState(null);
				return;
			}

			ShowToast('success', 'Item updated successfully');
			router.replace('/business/business-home');
		} catch (error: any) {
			ShowToast('error', error.response?.data.message || 'Update failed');
		}
		setLoadingState(null);
	};

	const onDurationChange = (val: string) => {
		setDuration(val);
		const num = parseInt(val);
		if (!num || num <= 0) {
			setDurationError('Duration must be a positive number');
			return;
		}
		const limits = { days: 30, hours: 24, minutes: 60 };
		if (num > limits[timeUnit as keyof typeof limits]) {
			setDurationError(
				`Duration must be between 1 and ${
					limits[timeUnit as keyof typeof limits]
				}`
			);
		} else {
			setDurationError('');
		}
	};
	if (loadingState === 'init')
		return <LoadingSpinner label="Loading item data..." />;

	if (itemNotFound) {
		return (
			<View className="flex-1 justify-center items-center bg-white">
				<Text className="text-xl text-gray-600">Item not found</Text>
			</View>
		);
	}

	return (
		<ScrollView className="flex-1 p-4 bg-white">
			<Text className="text-xl mb-8">
				Update details of your business item
			</Text>

			<ItemForm
				desc={desc}
				setDesc={setDesc}
				price={price}
				setPrice={setPrice}
				file={file}
				setFile={setFile}
				duration={duration}
				setDuration={setDuration}
				timeUnit={timeUnit}
				setTimeUnit={setTimeUnit}
				durationError={durationError}
				onDurationChange={onDurationChange}
				currency={currency}
			/>

			<HapticButton
				onPress={handleSubmit}
				disabled={loadingState !== null}
				className="rounded-full py-4 items-center mt-0 bg-indigo-700"
			>
				{loadingState === 'edit' ? (
					<ActivityIndicator color="#fff" />
				) : (
					<ThemedText className="text-white font-semibold text-lg">
						Edit Item
					</ThemedText>
				)}
			</HapticButton>
		</ScrollView>
	);
}
