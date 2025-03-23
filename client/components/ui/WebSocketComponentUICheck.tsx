import React from "react";
import { Text, Button, View } from "react-native";
import { useWebSocketContext } from "../../context/WebSocketContext";

const WebSocketComponent = () => {
  const { sendMessage, lastMessage, readyState } = useWebSocketContext();

  const connectionStatusMap: Record<number, string> = {
    0: "🔴 Connecting...",
    1: "🟢 Open",
    2: "🟡 Closing...",
    3: "⚫ Closed",
  };

  const connectionStatus =
    connectionStatusMap[readyState] || "❓ Unknown State";

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>WebSocket Status: {connectionStatus}</Text>
      <Text style={{ marginVertical: 10, fontSize: 16 }}>
        Last Message: {lastMessage?.data || "No messages yet"}
      </Text>
      <Button
        title="Send Message"
        onPress={() => sendMessage("Hello WebSocket!")}
      />
    </View>
  );
};

export default WebSocketComponent;
