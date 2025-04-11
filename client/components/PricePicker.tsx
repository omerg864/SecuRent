import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from './ui/touchable-opacity';
import { currencies } from '@/utils/constants';

const AmountBtn = ({ onPress, children }: any) => (
	<TouchableOpacity
		className="border-2 border-gray-300 rounded-lg w-12 h-12 items-center justify-center"
		onPress={onPress}
	>
		<Text className="text-2xl">{children}</Text>
	</TouchableOpacity>
);

interface PricePickerProps {
	price: number;
	setPrice: (price: number) => void;
	currency: string;
	amounts?: number[];
	label?: string;
	containerStyle?: string;
}

const PricePicker = ({
	price,
	setPrice,
	currency,
	amounts,
	label,
	containerStyle,
}: PricePickerProps) => {
	const [editAmount, setEditAmount] = useState<boolean>(false);

	const defaultAmounts = [100, 500, 1000];
	amounts = amounts || defaultAmounts;

	const format = {
		date: (d: Date) => d.toLocaleDateString('en-GB'),
		time: (d: Date) =>
			d.toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
			}),
		currency: (n: number) =>
			n.toLocaleString() +
			currencies.find((c) => c.code === currency)?.symbol,
	};

	return (
		<View className={`${containerStyle}`}>
			<Text className="text-lg font-semibold mb-3">{label}</Text>
			<View className="flex-row items-center mb-4">
				<AmountBtn onPress={() => setPrice(Math.max(0, price - 50))}>
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
				<AmountBtn onPress={() => setPrice(price + 50)}>+</AmountBtn>
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
	);
};

export default PricePicker;
