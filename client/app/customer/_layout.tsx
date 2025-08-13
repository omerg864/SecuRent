import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { WebSocketProvider } from '@/context/WebSocketContext';
import {
	DrawerContentScrollView,
	DrawerItemList,
	DrawerItem,
} from '@react-navigation/drawer';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import WebSocketCustomerNotification from '@/components/WebSocketCustomerNotifications';
import { logout } from '@/utils/functions';
import { CustomerProvider } from '@/context/CustomerContext';

export default function Layout() {
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await logout(() => router.replace('/login'));
		} catch (error) {
			console.error('Error during logout:', error);
		}
	};

	const CustomDrawerContent = (props: any) => (
		<View className="flex-1">
			<DrawerContentScrollView
				{...props}
				contentContainerStyle={{ flex: 1 }}
			>
				<DrawerItemList {...props} />
			</DrawerContentScrollView>

			<View className="border-t border-gray-200 px-4 py-2">
				<DrawerItem
					label="Logout"
					labelStyle={{ color: 'red', fontWeight: 'bold' }}
					onPress={handleLogout}
				/>
			</View>
		</View>
	);

	return (
		<WebSocketProvider>
			<WebSocketCustomerNotification />
			<GestureHandlerRootView style={{ flex: 1 }}>
				<Drawer
					drawerContent={(props) => (
						<CustomDrawerContent {...props} />
					)}
					screenOptions={{
						drawerStyle: { backgroundColor: '#FFFFFF' },
						drawerLabelStyle: { color: 'black' },
						headerStyle: { backgroundColor: '#4338CA' },
						headerTintColor: 'white',
					}}
				>
					<Drawer.Screen
						name="index"
						options={{
							drawerLabel: 'Home',
							title: 'Home',
						}}
					/>
					<Drawer.Screen
						name="BusinessProfileScreen"
						options={{
							drawerLabel: 'Business Profile',
							title: 'Business Profile',
							drawerItemStyle: { display: 'none' },
							headerShown: true,
						}}
					/>
					<Drawer.Screen
						name="BusinessesMap"
						options={{
							drawerLabel: 'Businesses Map',
							title: 'Businesses Map',
						}}
					/>
					<Drawer.Screen
						name="QRScanner"
						options={{
							drawerLabel: 'QR Scanner',
							title: 'QR Scanner',
						}}
					/>
					<Drawer.Screen
						name="transactions"
						options={{
							drawerLabel: 'Transactions',
							title: 'Transactions',
						}}
					/>
					<Drawer.Screen
						name="approve-transaction"
						options={{
							drawerLabel: 'Approve Transaction',
							title: 'Approve Transaction',
							drawerItemStyle: { display: 'none' },
							headerShown: true,
						}}
					/>
					<Drawer.Screen
						name="transaction-details"
						options={{
							drawerLabel: 'Transaction Details',
							title: 'Transaction Details',
							drawerItemStyle: { display: 'none' },
							headerShown: false,
						}}
					/>
					<Drawer.Screen
						name="add-review"
						options={{
							drawerLabel: 'Add Review',
							headerShown: false,
							drawerItemStyle: { display: 'none' },
						}}
					/>
					<Drawer.Screen
						name="display-review"
						options={{
							drawerLabel: 'Add Review',
							headerShown: false,
							drawerItemStyle: { display: 'none' },
						}}
					/>
					<Drawer.Screen
						name="item-profile"
						options={{
							drawerLabel: 'Item Profile',
							title: 'Item Profile',
							drawerItemStyle: { display: 'none' },
							headerShown: true,
						}}
					/>
					<Drawer.Screen
						name="report-page"
						options={{
							title: 'Report Page',
							drawerItemStyle: { display: 'none' },
							headerShown: false,
						}}
					/>
					<Drawer.Screen
						name="add-payment"
						options={{
							title: 'Change Payment Method',
							drawerItemStyle: { display: 'none' },
						}}
					/>
					<Drawer.Screen
						name="update-customer"
						options={{
							title: 'Customer Details',
							drawerItemStyle: { display: 'none' },
						}}
					/>
					<Drawer.Screen
						name="settings"
						options={{
							drawerLabel: 'Settings',
							title: 'Settings',
						}}
					/>
					<Drawer.Screen
						name="QRCodeScreen"
						options={{
							drawerLabel: 'QR Code',
							title: 'QR Code',
							drawerItemStyle: { display: 'none' },
							headerShown: false,
						}}
					/>
				</Drawer>
			</GestureHandlerRootView>
		</WebSocketProvider>
	);
}
