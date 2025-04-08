import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { WebSocketProvider } from '@/context/WebSocketContext';
import {
	DrawerContentScrollView,
	DrawerItemList,
	DrawerItem,
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';

export default function Layout() {
	const router = useRouter();

	const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("Business_Data");
            await AsyncStorage.removeItem("Access_Token");
            await AsyncStorage.removeItem("Refresh_Token");
            await AsyncStorage.removeItem("Auth_Expiration");
            await AsyncStorage.removeItem("UserID");
        
            router.replace("/login"); 
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }

	const CustomDrawerContent = (props: any) => (
		<View className="flex-1">
			<DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
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
			<GestureHandlerRootView style={{ flex: 1 }}>
				<Drawer
					drawerContent={(props) => <CustomDrawerContent {...props} />}
					screenOptions={{
						drawerStyle: { backgroundColor: '#FFFFFF' },
						drawerLabelStyle: { color: 'black' },
						headerStyle: { backgroundColor: '#4338CA' },
						headerTintColor: 'white',
					}}
				>
					<Drawer.Screen
						name="business-home"
						options={{
							drawerLabel: 'Home',
							title: 'Home',
						}}
					/>
					<Drawer.Screen
						name="new-transaction"
						options={{
							drawerLabel: 'New Transaction',
							title: 'New Transaction',
						}}
					/>
					<Drawer.Screen
						name="transaction-details"
						options={{
							drawerLabel: 'details Transaction',
							title: 'details Transaction',
						}}
					/>
				</Drawer>
			</GestureHandlerRootView>
		</WebSocketProvider>
	);
}
