import React from "react";
import { Text, Alert, Linking } from "react-native";

interface ConfirmEmailLinkProps {
    email: string;
    recipientName: string;
    businessName?: string;
    className?: string;
}

const ConfirmEmailLink: React.FC<ConfirmEmailLinkProps> = ({
    email,
    recipientName,
    businessName = "Your Business",
    className = "text-md font-medium text-blue-600 underline mb-2"
}) => {
    const handlePress = () => {
        Alert.alert(
            "Send Email",
            `Do you want to send an email to ${recipientName}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Send",
                    onPress: () => {
                        const subject = "Regarding your rental";
                        const body = `Hi ${recipientName},\n\n[Write your message here]\n\nBest regards,\n${businessName}`;
                        const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
                            subject
                        )}&body=${encodeURIComponent(body)}`;
                        Linking.openURL(mailtoUrl);
                    }
                }
            ]
        );
    };

    return (
        <Text
            className={className}
            onPress={handlePress}
        >
            {email}
        </Text>
    );
};

export default ConfirmEmailLink;
