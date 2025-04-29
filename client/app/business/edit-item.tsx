import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Alert
} from "react-native";
import ProfileImageInput from "@/components/ProfileImageInput";
import { FileObject } from "@/types/business";
import { Picker } from "@react-native-picker/picker";
import PricePicker from "@/components/PricePicker";
import Toast from "react-native-toast-message";
import { ThemedText } from "@/components/ui/ThemedText";
import {
    deleteItemById,
    getItemByIdForBusiness,
    updateItemById
} from "@/services/itemService";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getBusinessCurrencySymbol } from "@/utils/functions";
import { Item } from "@/services/interfaceService";
import HapticButton from "@/components/ui/HapticButton";
import ItemForm from "@/components/forms/ItemForm";

export default function EditItem() {
    // const { id } = useLocalSearchParams<{ id: string }>();
    const id = "680f9da65bda4dd5928f17c3"; // temporary id till we connect to a real one
    const router = useRouter();

    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState(0);
    const [file, setFile] = useState<FileObject | null>(null);
    const [duration, setDuration] = useState("");
    const [timeUnit, setTimeUnit] = useState("days");
    const [durationError, setDurationError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currency, setCurrency] = useState("ILS");
    const [initialLoading, setInitialLoading] = useState(true);
    const [originalImageExists, setOriginalImageExists] = useState(false);
    const [itemNotFound, setItemNotFound] = useState(false);

    const timeUnits = ["minutes", "hours", "days"];

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await getItemByIdForBusiness(id);
                const item = response.item as Item;

                if (!item) {
                    setItemNotFound(true);
                    return;
                }

                setDesc(item.description);
                setPrice(item.price);
                setDuration(String(item.duration || ""));
                setTimeUnit(item.timeUnit || "days");

                if (item.image) {
                    setFile({
                        uri: item.image,
                        name: "image.jpg",
                        type: "image/jpeg"
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
                    Toast.show({ type: "error", text1: "Error fetching item" });
                    router.back();
                }
            } finally {
                setInitialLoading(false);
            }
        };

        const getSymbol = async () => {
            const symbol = await getBusinessCurrencySymbol();
            setCurrency(symbol);
        };

        fetchItem();
        getSymbol();
    }, [id]);

    const handleSubmit = async () => {
        if (durationError || !duration || !desc || !price) {
            Toast.show({
                type: "error",
                text1: "Please fill all required fields correctly"
            });
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();

            formData.append("description", desc);
            formData.append("price", String(price));
            formData.append("duration", String(parseInt(duration)));
            formData.append("timeUnit", timeUnit);

            if (file) {
                if (file.uri.startsWith("file://")) {
                    formData.append("image", {
                        uri: file.uri,
                        name: file.name,
                        type: file.type
                    } as any);
                }
            } else if (!file && originalImageExists) {
                formData.append("imageDeleteFlag", "true");
            }

            const response = await updateItemById(
                id,
                desc,
                price,
                parseInt(duration),
                timeUnit,
                file,
                formData
            );

            if (!response) {
                Toast.show({ type: "error", text1: "Internal Server Error" });
                setIsLoading(false);
                return;
            }

            Toast.show({ type: "success", text1: "Item updated successfully" });
            router.replace("/business/business-home");
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: error.response?.data.message || "Update failed"
            });
        }
        setIsLoading(false);
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Item",
            "Are you sure you want to delete this item?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setIsLoading(true);
                            await deleteItemById(id);
                            Toast.show({
                                type: "success",
                                text1: "Item deleted successfully"
                            });
                            router.replace("/business/business-home");
                        } catch (error: any) {
                            Toast.show({
                                type: "error",
                                text1:
                                    error.response?.data.message ||
                                    "Delete failed"
                            });
                        } finally {
                            setIsLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const onDurationChange = (val: string) => {
        setDuration(val);
        const num = parseInt(val);
        if (!num || num <= 0) {
            setDurationError("Duration must be a positive number");
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
            setDurationError("");
        }
    };

    if (initialLoading) {
        return (
            <View className='flex-1 justify-center items-center bg-white'>
                <ActivityIndicator
                    size='large'
                    color='#4338CA'
                />
            </View>
        );
    }

    if (itemNotFound) {
        return (
            <View className='flex-1 justify-center items-center bg-white'>
                <Text className='text-xl text-gray-600'>Item not found</Text>
            </View>
        );
    }

    return (
        <ScrollView className='flex-1 p-4 bg-white'>
            <Text className='text-xl font-bold mb-2'>Edit Item</Text>
            <Text className='text-xl mb-8'>
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
                disabled={isLoading}
                className='rounded-full py-4 items-center mt-1 bg-indigo-700'
            >
                {isLoading ? (
                    <ActivityIndicator color='#fff' />
                ) : (
                    <ThemedText className='text-white font-semibold text-lg'>
                        Edit Item
                    </ThemedText>
                )}
            </HapticButton>

            <HapticButton
                onPress={handleDelete}
                disabled={isLoading}
                className='rounded-full py-3 items-center mt-2 bg-red-500 w-64 self-center'
            >
                {isLoading ? (
                    <ActivityIndicator color='#fff' />
                ) : (
                    <ThemedText className='text-white font-semibold text-base'>
                        Delete Item
                    </ThemedText>
                )}
            </HapticButton>
        </ScrollView>
    );
}
