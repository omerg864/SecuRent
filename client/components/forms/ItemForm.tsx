import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
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
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [timeUnitItems, setTimeUnitItems] = useState([
        { label: "Minutes", value: "minutes" },
        { label: "Hours", value: "hours" },
        { label: "Days", value: "days" }
    ]);

    const handleSafeDurationChange = (val: string) => {
        if (!/^\d*$/.test(val)) return;
        onDurationChange(val);
    };

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
                value={desc || ""}
                onChangeText={setDesc}
                placeholder='Enter item description'
            />

            {/* Price */}
            <PricePicker
                label='Price'
                price={price}
                setPrice={setPrice}
                currency={currency}
            />

            {/* Duration */}
            <View className='mt-8 mb-6 z-10'>
                <Text className='text-lg font-semibold mb-3'>Duration</Text>
                <View className='flex-row gap-4 items-center'>
                    <View
                        className='flex-1 justify-center'
                        style={{
                            borderColor: "#D1D5DB",
                            borderWidth: 1,
                            borderRadius: 12,
                            height: 48,
                            backgroundColor: "#ffffff"
                        }}
                    >
                        <TextInput
                            style={{
                                height: "100%",
                                paddingHorizontal: 16,
                                fontSize: 16,
                                color: "#000000",
                                textAlign: "center",
                                textAlignVertical: "center"
                            }}
                            keyboardType='numeric'
                            value={duration || ""}
                            onChangeText={handleSafeDurationChange}
                            placeholder='Enter duration'
                            placeholderTextColor='#9CA3AF'
                        />
                    </View>

                    {/* DropDownPicker */}
                    <View className='flex-1 z-50'>
                        <DropDownPicker
                            open={dropdownOpen}
                            value={timeUnit}
                            items={timeUnitItems}
                            setOpen={setDropdownOpen}
                            setValue={(callback) =>
                                setTimeUnit(callback(timeUnit))
                            }
                            setItems={setTimeUnitItems}
                            style={{
                                borderColor: "#D1D5DB",
                                borderRadius: 12,
                                height: 48
                            }}
                            dropDownContainerStyle={{
                                borderColor: "#D1D5DB",
                                borderRadius: 12
                            }}
                            textStyle={{ fontSize: 16 }}
                            listMode='SCROLLVIEW'
                            scrollViewProps={{ nestedScrollEnabled: true }}
                        />
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
