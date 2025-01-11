import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	StyleSheet,
	Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HapticButton from '@/components/ui/HapticButton';
import { ThemedText } from '@/components/defaults/ThemedText';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
	const [email, setEmail] = useState('Louis04real@gmail.com');
	const [password, setPassword] = useState('password');
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	const handleLogin = () => {
		console.log('Login');
	};

	const handleRegister = () => {
		router.push('/register');
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<ThemedText type="title">Login</ThemedText>
			</View>

			<View style={styles.content}>
				<Text style={styles.title}>Welcome back</Text>
				<Text style={styles.subtitle}>
					Hey you're back, fill in your details to get back in
				</Text>

				<View style={styles.form}>
					<View style={styles.inputContainer}>
						<Text style={styles.label}>Email</Text>
						<TextInput
							style={styles.input}
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Password</Text>
						<View style={styles.passwordContainer}>
							<TextInput
								style={styles.passwordInput}
								value={password}
								onChangeText={setPassword}
								secureTextEntry={!showPassword}
							/>
							<TouchableOpacity
								onPress={() => setShowPassword(!showPassword)}
								style={styles.eyeIcon}
							>
								<Ionicons
									name={showPassword ? 'eye-off' : 'eye'}
									size={24}
									color={Colors.light.tint}
								/>
							</TouchableOpacity>
						</View>
					</View>

					<TouchableOpacity style={styles.forgotPassword}>
						<Text style={styles.forgotPasswordText}>
							Forgot Password?
						</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.buttonContainer}>
					<HapticButton
						style={styles.registerButton}
						onPress={handleRegister}
					>
						<Text style={styles.registerButtonText}>Register</Text>
					</HapticButton>
					<HapticButton
						style={styles.loginButton}
						onPress={handleLogin}
					>
						<Text style={styles.loginButtonText}>Login</Text>
					</HapticButton>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingTop: 8,
		paddingBottom: 16,
	},
	backButton: {
		padding: 8,
	},
	headerTitle: {
		fontSize: 16,
		fontWeight: '500',
		marginLeft: 8,
	},
	content: {
		flex: 1,
		paddingHorizontal: 24,
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: '#1A1A1A',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 14,
		color: '#666',
		marginBottom: 32,
	},
	form: {
		gap: 20,
	},
	inputContainer: {
		gap: 8,
	},
	label: {
		fontSize: 14,
		color: '#666',
	},
	input: {
		height: 48,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		borderRadius: 8,
		paddingHorizontal: 16,
		fontSize: 16,
	},
	passwordContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#E5E5E5',
		borderRadius: 8,
	},
	passwordInput: {
		flex: 1,
		height: 48,
		paddingHorizontal: 16,
		fontSize: 16,
	},
	eyeIcon: {
		padding: 12,
	},
	forgotPassword: {
		alignSelf: 'flex-end',
	},
	forgotPasswordText: {
		color: Colors.light.tint,
		fontSize: 14,
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 'auto',
		marginBottom: 55,
		width: '100%',
	},
	registerButton: {
		height: 48,
		paddingVertical: 8,
		width: 100,
		borderRadius: 24,
		backgroundColor: '#F3F0FF',
		justifyContent: 'center',
		alignItems: 'center',
	},
	registerButtonText: {
		color: Colors.light.tint,
		fontSize: 16,
		fontWeight: '600',
	},
	loginButton: {
		height: 48,
		paddingVertical: 8,
		width: 100,
		borderRadius: 24,
		backgroundColor: Colors.light.tint,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loginButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});
