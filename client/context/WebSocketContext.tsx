import React, { createContext, useContext } from "react";
import useWebSocket, { ReadyState } from "react-native-use-websocket";

interface WebSocketContextType {
  sendMessage: (message: string) => void;
  lastMessage: WebSocketMessageEvent | null;
  readyState: ReadyState;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketUrl = "wss://echo.websocket.org"; // WebSocket Test Server (temporary)

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    // Everything here is temporary till we'll decide on the connection format that we want to use.

    shouldReconnect: () => true, // Should make the server live at all time
    reconnectInterval: 1500, // Reconnect after 1.5 seconds
    share: true, // Keeps the connection alive across all components
    onOpen: () => console.log("✅ WebSocket connected!"),
    onClose: (event) => console.log("❌ WebSocket closed:", event),
    onMessage: (event) => console.log("📩 Message received:", event.data),
  });

  return (
    <WebSocketContext.Provider value={{ sendMessage, lastMessage, readyState }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook for using WebSocket in components
export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  }
  return context;
};
