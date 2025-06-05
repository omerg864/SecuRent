import ShowToast from '@/components/ui/ShowToast';
import { APP_NAME, ITEM_NAME } from '@/utils/constants';
import {
	CameraView,
	CameraType,
	useCameraPermissions,
	BarcodeScanningResult,
} from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
			const split = data.split('://');
			const app_name = split[0];
			if (app_name !== APP_NAME) {
				ShowToast(
					'error',
					'Invalid QR Code',
					'Please scan a valid QR code.'
				);

				setScanned(false);
				return;
			}
			if (!split[1]) {
				ShowToast(
					'error',
					'Invalid QR Code',
					'Please scan a valid QR code.'
				);

				setScanned(false);
				return;
			}
			const contextSplit = split[1].split('-');
			const codeType = contextSplit[0];
			if (codeType !== ITEM_NAME) {
				ShowToast(
					'error',
					'Invalid QR Code',
					'Please scan a valid QR code.'
				);

				setScanned(false);
				return;
			}
			const id = contextSplit[1];
			// check if id is valid
			if (!id) {
				ShowToast(
					'error',
					'Invalid QR Code',
					'Please scan a valid QR code.'
				);

				setScanned(false);
				return;
			}
			ShowToast('success', 'QR Code');

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
		<View className="flex-1 justify-center relative">
			<CameraView
				style={styles.camera}
				facing={facing}
				barcodeScannerSettings={{
					barcodeTypes: ['qr'],
				}}
				onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
			/>
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
		</View>
	);
}

const styles = StyleSheet.create({
	camera: {
		flex: 1,
	},
});
