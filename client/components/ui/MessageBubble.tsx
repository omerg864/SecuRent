import React from "react";
import { Text, View } from "react-native";

const Bubble = View;
const BubbleText = Text;

type Props = {
    text: string;
    isUser: boolean;
};

const MessageBubble: React.FC<Props> = ({ text, isUser }) => {
    return (
        <Bubble
            className={`max-w-[80%] px-3 py-2 rounded-lg my-1 ${
                isUser ? "bg-blue-100 self-end" : "bg-gray-200 self-start"
            }`}
        >
            <BubbleText className='text-base'>{text}</BubbleText>
        </Bubble>
    );
};

export default MessageBubble;
