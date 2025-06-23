import { useWebSocketContext } from '@/context/WebSocketContext';
import React, { useEffect } from 'react';
import ShowToast from '@/components/ui/ShowToast';
import { Notification } from '@/types/notification';
import { useCustomer } from '@/context/CustomerContext';
import { logout } from '@/utils/functions';
import { useRouter } from 'expo-router';

const WebSocketCustomerNotifications = () => {
	const { lastMessage } = useWebSocketContext();
	const { customer } = useCustomer();
	const router = useRouter();

	const handleSuspensionNotification = async () => {
		await logout(() => router.replace('/login'));
	};

	useEffect(() => {
		if (lastMessage && lastMessage.data) {
			try {
				const parsedMessage = JSON.parse(lastMessage.data);
				if (parsedMessage.type === 'notification') {
					// Handle the notification message
					const notification: Notification =
						parsedMessage.data.notification;
					console.log('Notification received:', notification);
					ShowToast('info', notification.title, notification.content);
					if (
						notification.title.includes('Suspension') &&
						customer?._id === notification.customer
					) {
						handleSuspensionNotification();
					}
				}
			} catch (error) {
				console.debug('Error parsing WebSocket message:', error);
			}
		}
	}, [lastMessage]);
	return <></>;
};

export default WebSocketCustomerNotifications;
