import React, { createContext, useContext, useEffect, useState } from 'react';
import useWebSocket, {
	ReadyState,
	SendMessage,
} from 'react-native-use-websocket';
import Constants from 'expo-constants';
import { checkToken } from '@/services/httpClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WebSocketContextType {
	sendMessage: SendMessage | null;
	lastMessage: WebSocketMessageEvent | null;
	readyState: ReadyState;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
	undefined
);

export const WebSocketProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const socketUrl = Constants.expoConfig?.extra?.webSocketUrl as string;

	const authWebSocket = async () => {
		try {
			const token = await checkToken();
			const type = await AsyncStorage.getItem('current_account_type');
			sendMessage(
				JSON.stringify({
					type: 'auth',
					data: {
						token,
						type,
					},
				})
			);
		} catch (error) {
			console.error('WebSocket token error:', error);
		}
	};

	const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
		shouldReconnect: () => true,
		reconnectInterval: 1500,
		share: true,
		onOpen: () => console.log('✅ WebSocket connected'),
		onClose: (event) => console.log('❌ WebSocket closed', event),
		onMessage: (event) => console.log('📨 Message received', event.data),
		onError: (event) => console.log('❌ WebSocket error', event),
	});

	useEffect(() => {
		if (lastMessage) {
			try {
				const parsedMessage = JSON.parse(lastMessage.data);
				if (parsedMessage.type === 'auth') {
					authWebSocket();
				}
			} catch (error) {
				console.error('Error parsing WebSocket message:', error);
			}
		}
	}, [lastMessage]);

	return (
		<WebSocketContext.Provider
			value={{ sendMessage, lastMessage, readyState }}
		>
			{children}
		</WebSocketContext.Provider>
	);
};

export const useWebSocketContext = () => {
	const context = useContext(WebSocketContext);
	if (!context) {
		throw new Error(
			'useWebSocketContext must be used within a WebSocketProvider'
		);
	}
	return context;
};
