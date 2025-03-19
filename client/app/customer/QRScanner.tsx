import {
	CameraView,
	CameraType,
	useCameraPermissions,
	BarcodeScanningResult,
} from 'expo-camera';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
	Button,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Alert,
} from 'react-native';

export default function QRScannerScreen() {
	const [facing, setFacing] = useState<CameraType>('back');
	const [permission, requestPermission] = useCameraPermissions();
	const [scanned, setScanned] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (!permission) {
			requestPermission();
		}
	}, []);

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>
					We need your permission to access the camera
				</Text>
				<Button onPress={requestPermission} title="Grant Permission" />
			</View>
		);
	}

	const handleBarCodeScanned = (result: BarcodeScanningResult) => {
		if (!scanned) {
			setScanned(true);
			Alert.alert('QR Code Scanned', `Data: ${result.data}`, [
				{ text: 'OK', onPress: () => setScanned(false) },
			]);
		}
	};

	return (
		<View style={styles.container}>
			<CameraView
				style={styles.camera}
				facing={facing}
				barcodeScannerSettings={{
					barcodeTypes: ['qr'],
				}}
				onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
			>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.button}
						onPress={() =>
							setFacing(facing === 'back' ? 'front' : 'back')
						}
					>
						<Text style={styles.text}>Flip Camera</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.button}
						onPress={() => router.back()}
					>
						<Text style={styles.text}>Go Back</Text>
					</TouchableOpacity>
				</View>
			</CameraView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	message: {
		textAlign: 'center',
		paddingBottom: 10,
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		position: 'absolute',
		bottom: 20,
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-around',
		paddingHorizontal: 20,
	},
	button: {
		backgroundColor: 'rgba(0,0,0,0.6)',
		padding: 10,
		borderRadius: 10,
	},
	text: {
		fontSize: 18,
		color: 'white',
	},
});
