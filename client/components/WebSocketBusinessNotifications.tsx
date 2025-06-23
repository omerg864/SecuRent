import { useWebSocketContext } from '@/context/WebSocketContext';
import React, { useEffect } from 'react';
import ShowToast from '@/components/ui/ShowToast';
import { Notification } from '@/types/notification';
import { useBusiness } from '@/context/BusinessContext';

const WebSocketBusinessNotifications = () => {
	const { lastMessage } = useWebSocketContext();
	const { business, updateBusiness } = useBusiness();

	const handleSuspensionNotification = async (suspended: boolean) => {
		await updateBusiness({ suspended });
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
						notification.content.includes(
							'Your account has been suspended'
						) &&
						business?._id === notification.business
					) {
						handleSuspensionNotification(true);
					}

					if (
						notification.content.includes(
							'Your account has been released from suspension'
						) &&
						business?._id === notification.business
					) {
						handleSuspensionNotification(false);
					}
				}
			} catch (error) {
				console.debug('Error parsing WebSocket message:', error);
			}
		}
	}, [lastMessage]);
	return <></>;
};

export default WebSocketBusinessNotifications;
