import React, { useState, useEffect, useRef } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
    Text,
    SafeAreaView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    initBusinessAdvisor,
    chatBusinessAdvisor
} from "@/services/businessService";
import { BUSINESS_DATA } from "@/utils/asyncStorageConstants";
import MessageBubble from "@/components/ui/MessageBubble";

type Message = { role: "user" | "bot"; text: string };

const AIAssistant: React.FC = () => {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingReply, setLoadingReply] = useState(false);
    const scrollRef = useRef<ScrollView>(null);

    // גלילה אוטומטית בסיום כל הודעה
    useEffect(() => {
        const timeout = setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
        }, 50);
        return () => clearTimeout(timeout);
    }, [messages]);

    // אתחול השיחה
    useEffect(() => {
        const startSession = async () => {
            try {
                const raw = await AsyncStorage.getItem(BUSINESS_DATA);
                if (!raw) throw new Error("No business data found");
                const { _id } = JSON.parse(raw);
                if (!_id) throw new Error("Business ID missing");

                console.log("🔑 Business ID:", _id);

                const { sessionId, firstMessage } = await initBusinessAdvisor(
                    _id
                );
                console.log("🎯 Session ID received:", sessionId);

                setSessionId(sessionId);

                if (firstMessage) {
                    setMessages([{ role: "bot", text: firstMessage }]);
                }
            } catch (err: any) {
                console.error("❌ Init error:", err);
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        startSession();
    }, []);

    // שליחת הודעה
    const sendMessage = async () => {
        if (!input.trim() || !sessionId) return;

        const userMessage = input.trim();
        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
        setInput("");
        setLoadingReply(true);

        try {
            const { advisorReply } = await chatBusinessAdvisor(
                sessionId,
                userMessage
            );

            setMessages((prev) => [
                ...prev,
                { role: "bot", text: advisorReply }
            ]);
        } catch (err) {
            console.error("❌ Chat error:", err);
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: "משהו השתבש. נסה שוב מאוחר יותר." }
            ]);
        } finally {
            setLoadingReply(false);
        }
    };

    if (loading) {
        return (
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator size='large' />
            </View>
        );
    }

    if (error || !sessionId) {
        return (
            <View className='p-4'>
                <Text className='text-red-600'>
                    {error || "לא הצלחנו להתחבר לעוזר העסקי."}
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <KeyboardAvoidingView
                className='flex-1 p-4'
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    ref={scrollRef}
                    className='flex-1'
                    contentContainerStyle={{
                        paddingTop: 12,
                        paddingBottom: 80
                    }}
                >
                    {messages.map((msg, i) => (
                        <MessageBubble
                            key={i}
                            text={msg.text}
                            isUser={msg.role === "user"}
                        />
                    ))}
                    {loadingReply && (
                        <MessageBubble
                            text='כותב...'
                            isUser={false}
                        />
                    )}
                </ScrollView>

                <View className='flex-row items-center mt-2'>
                    <TextInput
                        value={input}
                        onChangeText={setInput}
                        placeholder='שאל משהו...'
                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2'
                        onSubmitEditing={sendMessage}
                        returnKeyType='send'
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        disabled={loadingReply}
                        className='bg-blue-500 px-4 py-2 rounded-lg'
                    >
                        <Text className='text-white'>
                            {loadingReply ? "..." : "שלח"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AIAssistant;
