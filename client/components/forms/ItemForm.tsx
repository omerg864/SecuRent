import React from "react";
import { View, Text, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import ProfileImageInput from "@/components/ProfileImageInput";
import PricePicker from "@/components/PricePicker";
import { FileObject } from "@/types/business";

interface ItemFormProps {
    desc: string;
    setDesc: (val: string) => void;

    price: number;
    setPrice: (val: number) => void;

    file: FileObject | null;
    setFile: (file: FileObject | null) => void;

    duration: string;
    setDuration: (val: string) => void;

    timeUnit: string;
    setTimeUnit: (val: string) => void;

    durationError: string;
    onDurationChange: (val: string) => void;

    currency: string;
}

export default function ItemForm({
    desc,
    setDesc,
    price,
    setPrice,
    file,
    setFile,
    duration,
    setDuration,
    timeUnit,
    setTimeUnit,
    durationError,
    onDurationChange,
    currency
}: ItemFormProps) {
    const timeUnits = ["minutes", "hours", "days"];

    return (
        <View>
            {/* Image Upload */}
            <ProfileImageInput
                file={file}
                containerClassName='mb-6'
                themeText={false}
                labelClassName='text-black'
                label='Item Image'
                setFile={setFile}
            />

            {/* Description */}
            <Text className='text-lg font-semibold mb-2'>Description</Text>
            <TextInput
                className='border border-gray-300 rounded-lg p-3 text-lg bg-gray-100 mb-6'
                value={desc}
                onChangeText={setDesc}
            />

            {/* Price */}
            <PricePicker
                label='Price'
                price={price}
                setPrice={setPrice}
                currency={currency}
            />

            {/* Duration */}
            <View className='mt-8 mb-6'>
                <Text className='text-lg font-semibold mb-3'>Duration</Text>
                <View className='flex-row gap-4 items-center'>
                    <View className='flex-1'>
                        <TextInput
                            className={`border rounded-xl px-3 text-lg text-center bg-gray-100 h-12 ${
                                durationError
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            style={{ textAlignVertical: "center" }}
                            keyboardType='numeric'
                            value={duration}
                            onChangeText={onDurationChange}
                        />
                    </View>

                    <View className='flex-1 border border-gray-300 rounded-xl bg-white h-44 justify-center'>
                        <Picker
                            selectedValue={timeUnit}
                            onValueChange={setTimeUnit}
                            style={{ height: "100%" }}
                            itemStyle={{ fontSize: 18 }}
                        >
                            {timeUnits.map((unit) => (
                                <Picker.Item
                                    key={unit}
                                    label={
                                        unit.charAt(0).toUpperCase() +
                                        unit.slice(1)
                                    }
                                    value={unit}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                {durationError ? (
                    <Text className='text-red-500 mt-2 ml-1 text-sm'>
                        {durationError}
                    </Text>
                ) : null}
            </View>
        </View>
    );
}
