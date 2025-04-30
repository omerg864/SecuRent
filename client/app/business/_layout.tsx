import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { WebSocketProvider } from "@/context/WebSocketContext";
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";

export default function Layout() {
    const router = useRouter();
    //<ActivityIndicator size="small" color="#4B5563"/>
    // <Text className="text-2xl font-medium w-24 text-center text-[#2D2A2E]">
    //   {amount > 0 ? `${amount}₪` : amount}
    // </Text>
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("Business_Data");
            await AsyncStorage.removeItem("Access_Token");
            await AsyncStorage.removeItem("Refresh_Token");
            await AsyncStorage.removeItem("Auth_Expiration");
            await AsyncStorage.removeItem("current_account_type");
            await AsyncStorage.removeItem("UserID");

            router.replace("/login");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const CustomDrawerContent = (props: any) => (
        <View className='flex-1'>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ flex: 1 }}
            >
                <DrawerItemList {...props} />
            </DrawerContentScrollView>

            <View className='border-t border-gray-200 px-4 py-2'>
                <DrawerItem
                    label='Logout'
                    labelStyle={{ color: "red", fontWeight: "bold" }}
                    onPress={handleLogout}
                />
            </View>
        </View>
    );

    return (
        <WebSocketProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Drawer
                    drawerContent={(props) => (
                        <CustomDrawerContent {...props} />
                    )}
                    screenOptions={{
                        drawerStyle: { backgroundColor: "#FFFFFF" },
                        drawerLabelStyle: { color: "black" },
                        headerStyle: { backgroundColor: "#4338CA" },
                        headerTintColor: "white"
                    }}
                >
                    <Drawer.Screen
                        name='business-home'
                        options={{
                            drawerLabel: "Home",
                            title: "Home"
                        }}
                    />
                    <Drawer.Screen
                        name='new-transaction'
                        options={{
                            drawerLabel: "New Transaction",
                            title: "New Transaction"
                        }}
                    />
                    <Drawer.Screen
                        name='QRCodeScreen'
                        options={{
                            drawerLabel: "QR Code",
                            title: "QR Code",
                            drawerItemStyle: { display: "none" },
                            headerShown: false
                        }}
                    />
                    <Drawer.Screen
                        name='transactions'
                        options={{
                            drawerLabel: "Transactions",
                            title: "Transactions"
                        }}
                    />
                    <Drawer.Screen
                        name='charge-deposit'
                        options={{
                            drawerLabel: "Charge deposit",
                            title: "Charge deposit",
                            drawerItemStyle: { display: "none" },
                            headerShown: false
                        }}
                    />
                    <Drawer.Screen
                        name='transaction-details'
                        options={{
                            drawerLabel: "Transaction Details",
                            title: "Transaction Details",
                            drawerItemStyle: { display: "none" },
                            headerShown: false
                        }}
                    />
                    <Drawer.Screen
                        name='new-item'
                        options={{
                            drawerLabel: "New Item",
                            title: "New Item"
                        }}
                    />
					<Drawer.Screen
						name="BusinessProfileScreen"
						options={{
							drawerLabel: 'Profile Page',
							title: 'Profile Page',
						}}
					/>
                    <Drawer.Screen
                        name='edit-item'
                        options={{
                            drawerLabel: "Edit Item",
                            title: "Edit Item",
                            drawerItemStyle: { display: "none" },
                            headerShown: true
                        }}
                    />
                    <Drawer.Screen
                        name='item-profile'
                        options={{
                            drawerLabel: "Item Profile",
                            title: "Item Profile",
                            drawerItemStyle: { display: "none" },
                            headerShown: true
                        }}
                    />
                </Drawer>
            </GestureHandlerRootView>
        </WebSocketProvider>
    );
}
