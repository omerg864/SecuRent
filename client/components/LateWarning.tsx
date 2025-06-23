import React from "react";
import { View, Text } from "react-native";

interface LateWarningProps {
    returnDate: string | Date | null | undefined;
    status: string;
}

function getTimeDiffText(returnDate: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - returnDate.getTime();

	if (diffMs <= 0) return "";

	const diffMinutes = Math.floor(diffMs / (1000 * 60));
	const days = Math.floor(diffMinutes / 1440);
	const hours = Math.floor((diffMinutes % 1440) / 60);
	const minutes = diffMinutes % 60;

	const parts = [];

	if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
	if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
	if (minutes > 0 || parts.length === 0)
		parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);

	return parts.join(" and ");
}


const LateWarning: React.FC<LateWarningProps> = ({ returnDate, status }) => {
    if (
        status !== "open" ||
        !returnDate ||
        new Date(returnDate) >= new Date()
    ) {
        return null;
    }

    const lateText = getTimeDiffText(new Date(returnDate));

    return (
        <View className='mt-2 bg-yellow-100 border-l-4 border-yellow-600 px-3 py-2 rounded-md'>
            <Text className='text-yellow-800 font-semibold mb-1'>
                Late Return Warning
            </Text>
            <Text className='text-yellow-700 text-sm'>
                This item was supposed to be returned by{" "}
                {new Date(returnDate).toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short"
                })}{" "}
                but was not returned yet.
            </Text>
            <Text className='text-yellow-700 text-sm font-medium mt-1'>
                Time overdue: {lateText} late.
            </Text>
        </View>
    );
};

export default LateWarning;
