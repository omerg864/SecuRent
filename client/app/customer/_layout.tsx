import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { WebSocketProvider } from '@/context/WebSocketContext';

export default function Layout() {
	return (
		<WebSocketProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<Drawer
					screenOptions={{
						drawerStyle: { backgroundColor: '#FFFFFF' }, // Keeping drawer white
						drawerLabelStyle: { color: 'black' },
						headerStyle: { backgroundColor: '#4338CA' }, // Tailwind bg-indigo-700 for top bar
						headerTintColor: 'white', // White text and icons
					}}
				>
					<Drawer.Screen
						name="index" // This is the name of the page and must match the url from root
						options={{
							drawerLabel: 'Home',
							title: 'Home',
						}}
					/>
					<Drawer.Screen
						name="logout" // This is the name of the page and must match the url from root
						options={{
							drawerLabel: 'Logout',
							title: 'Logout',
						}}
					/>
					<Drawer.Screen
						name="user/[id]" // This is the name of the page and must match the url from root
						options={{
							drawerLabel: 'User',
							title: 'overview',
						}}
					/>
				</Drawer>
			</GestureHandlerRootView>
		</WebSocketProvider>
	);
}
