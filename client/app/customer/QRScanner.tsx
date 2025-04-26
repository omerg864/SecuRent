import {
	CameraView,
	CameraType,
	useCameraPermissions,
	BarcodeScanningResult,
} from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
	Button,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function QRScannerScreen() {
	const [facing, setFacing] = useState<CameraType>('back');
	const [permission, requestPermission] = useCameraPermissions();
	const [scanned, setScanned] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (!permission) {
			requestPermission();
		}
		return () => {
			setScanned(false);
		};
	}, []);

	useFocusEffect(
		useCallback(() => {
			return () => {
				setScanned(false);
			};
		}, [])
	);

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		return (
			<View className="flex-1 justify-center items-center px-4">
				<Text className="text-center mb-4 text-base">
					We need your permission to access the camera
				</Text>
				<Button onPress={requestPermission} title="Grant Permission" />
			</View>
		);
	}

	const handleBarCodeScanned = (result: BarcodeScanningResult) => {
		if (!scanned) {
			setScanned(true);
			const data = result.data;
			// extract id from the scanned data data is in the format of secuRent://id
			const app_name = data.split('://')[0];
			if (app_name !== 'secuRent') {
				Toast.show({
					type: 'error',
					text1: 'Invalid QR Code',
					text2: 'Please scan a valid QR code.',
				});
				setScanned(false);
				return;
			}
			const id = data.split('://')[1];
			// check if id is valid
			if (!id) {
				Toast.show({
					type: 'error',
					text1: 'Invalid QR Code',
					text2: 'Please scan a valid QR code.',
				});
				setScanned(false);
				return;
			}
			Toast.show({
				type: 'success',
				text1: 'QR Code',
			});
			router.push({
				pathname: '/customer/approve-transaction',
				params: { id },
			});
			setScanned(false);
		}
	};

	const goBack = () => {
		router.back();
		setScanned(false);
	};

	return (
		<View className="flex-1 justify-center">
			<CameraView
				style={styles.camera}
				facing={facing}
				barcodeScannerSettings={{
					barcodeTypes: ['qr'],
				}}
				onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
			>
				<View className="absolute bottom-5 flex-row w-full justify-around px-5">
					<TouchableOpacity
						className="bg-black/60 px-4 py-2 rounded-lg"
						onPress={() =>
							setFacing(facing === 'back' ? 'front' : 'back')
						}
					>
						<Text className="text-white text-lg">Flip Camera</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className="bg-black/60 px-4 py-2 rounded-lg"
						onPress={goBack}
					>
						<Text className="text-white text-lg">Go Back</Text>
					</TouchableOpacity>
				</View>
			</CameraView>
		</View>
	);
}

const styles = StyleSheet.create({
	camera: {
		flex: 1,
	},
});
