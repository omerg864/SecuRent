import React, { useState } from 'react';
import HapticButton from './ui/HapticButton';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

interface PriceSelectorProps {
	title?: string;
	price: number;
	setPrice: (value: number) => void;
	displayPriceList?: boolean;
	priceList?: number[];
	currencySymbol: string;
	maxPrice?: number;
	steps?: number;
}

const defaultSteps = 20;
const defaultPriceList = [100, 500, 1000];

const PriceSelector: React.FC<PriceSelectorProps> = ({
	title,
	price,
	setPrice,
	priceList = defaultPriceList,
	maxPrice,
	currencySymbol,
	displayPriceList = true,
	steps = defaultSteps,
}) => {
	const [editAmount, setEditAmount] = useState(false);

	return (
		<View className="mb-8">
			<Text className="text-lg font-semibold mb-3">{title}</Text>
			<View className="flex-row items-center mb-4">
				<HapticButton
					className="border-2 border-gray-300 rounded-lg w-12 h-12 items-center justify-center"
					onPress={() => setPrice(Math.max(0, price - 50))}
				>
					<Text className="text-2xl">-</Text>
				</HapticButton>
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
							{price}
							{currencySymbol}
						</Text>
					)}
				</TouchableOpacity>
				<HapticButton
					className="border-2 border-gray-300 rounded-lg w-12 h-12 items-center justify-center"
					onPress={() =>
						maxPrice
							? setPrice(Math.min(price + steps, maxPrice))
							: setPrice(price + 50)
					}
				>
					<Text className="text-2xl">+</Text>
				</HapticButton>
			</View>
			<View className="flex-row justify-between">
				{displayPriceList &&
					priceList.map((p, index) => (
						<TouchableOpacity
							key={index}
							className={`border-2 rounded-lg py-4 flex-1 mx-1 items-center ${
								price === p
									? 'bg-indigo-600 border-indigo-600'
									: 'border-gray-300 bg-white'
							}`}
							onPress={() => setPrice(p)}
						>
							<Text
								className={`text-lg ${
									price === p ? 'text-white' : 'text-gray-700'
								}`}
							>
								{p}
								{currencySymbol}
							</Text>
						</TouchableOpacity>
					))}
			</View>
		</View>
	);
};

export default PriceSelector;
