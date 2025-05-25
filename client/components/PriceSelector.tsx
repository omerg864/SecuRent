import React, { useState } from "react";
import HapticButton from "./ui/HapticButton";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

interface PriceSelectorProps {
    title?: string;
    price: number;
    setPrice: (value: number) => void;
    displayPriceList?: boolean;
    currencySymbol: string;
    maxPrice?: number;
    steps?: number;
}

const defaultSteps = 20;
const defaultPercentageList = [10, 50, 100];

const PriceSelector: React.FC<PriceSelectorProps> = ({
    title,
    price,
    setPrice,
    maxPrice,
    currencySymbol,
    displayPriceList = true,
    steps = defaultSteps
}) => {
    const [editAmount, setEditAmount] = useState(false);

    return (
        <View className='mb-8'>
            <Text className='text-lg font-semibold mb-3'>{title}</Text>
            <View className='flex-row items-center mb-4'>
                <HapticButton
                    className='bg-white border-2 border-gray-300 rounded-lg w-12 h-12 items-center justify-center'
                    onPress={() => setPrice(Math.max(0, price - steps))}
                >
                    <Text className='text-2xl'>-</Text>
                </HapticButton>
                <TouchableOpacity
                    className='flex-1 items-center'
                    onPress={() => setEditAmount(true)}
                >
                    {editAmount ? (
                        <TextInput
                            className='text-2xl font-medium text-center'
                            keyboardType='numeric'
                            value={price.toString()}
                            onChangeText={(t) => setPrice(parseInt(t) || 0)}
                            onBlur={() => setEditAmount(false)}
                            autoFocus
                        />
                    ) : (
                        <Text className='text-2xl font-medium'>
                            {price}
                            {currencySymbol}
                        </Text>
                    )}
                </TouchableOpacity>
                <HapticButton
                    className='bg-white border-2 border-gray-300 rounded-lg w-12 h-12 items-center justify-center'
                    onPress={() =>
                        maxPrice
                            ? setPrice(Math.min(price + steps, maxPrice))
                            : setPrice(price + steps)
                    }
                >
                    <Text className='text-2xl'>+</Text>
                </HapticButton>
            </View>

            {displayPriceList && maxPrice && (
                <View className='flex-row justify-between'>
                    {defaultPercentageList.map((percent, index) => {
                        const value = Math.round((percent / 100) * maxPrice);
                        return (
                            <TouchableOpacity
                                key={index}
                                className={`border-2 rounded-lg py-4 flex-1 mx-1 items-center ${
                                    price === value
                                        ? "bg-indigo-600 border-indigo-600"
                                        : "border-gray-300 bg-white"
                                }`}
                                onPress={() => setPrice(value)}
                            >
                                <Text
                                    className={`text-lg ${
                                        price === value
                                            ? "text-white"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {percent}%
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

export default PriceSelector;
