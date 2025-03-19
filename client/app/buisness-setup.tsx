import { View, StyleSheet } from 'react-native';
import { Route, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import { ThemedText } from '@/components/ui/ThemedText';
import AccountButton from '@/components/AccountButton';
import { MaterialCommunityIcons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const BusinessSetupSteps = [
	{
		id: "email",
		title: "Verify your email address",
		subTitle: "Confirm your email to secure your account",
		icon: <MaterialCommunityIcons name="email-check" size={42} color="white" />,
		route: "/verify-email",
	},
	{
		id: "bank",
		title: "Add Bank Details",
		subTitle: "Link your bank account for transactions",
		icon: <MaterialIcons name="account-balance" size={42} color="white" />,
		route: "/bank-details",
	},
	{
		id: "verification",
		title: "Business Verification",
		subTitle: "Complete verification to activate your business account",
		icon: <Entypo name="briefcase" size={42} color="white" />,
		route: "/verification",
	},
];

export default function BusinessSetupScreen() {
	const router = useRouter();
	const [completedSteps, setCompletedSteps] = useState<string[]>([]);

	
	useEffect(() => {
		const loadCompletedSteps = async () => {
			const savedSteps = await AsyncStorage.getItem('completedSteps');
			if (savedSteps) {
				setCompletedSteps(JSON.parse(savedSteps));
			}
		};
		loadCompletedSteps();
	}, []);

	// Handle step completion
	const handleStepPress = async (route: string, id: string) => {
		router.push(route as Route);
		const updatedSteps = [...completedSteps, id];
		await AsyncStorage.setItem('completedSteps', JSON.stringify(updatedSteps));
		setCompletedSteps(updatedSteps);
	};

	const remainingSteps = BusinessSetupSteps.filter(step => !completedSteps.includes(step.id));

	useFocusEffect(
		useCallback(() => {
			if (remainingSteps.length === 0) {
				router.replace('/business/buisness-home');
			}
		}, [remainingSteps.length])
	);

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
			headerImage={
				<MaterialCommunityIcons
					name="clipboard-check-outline"
					size={250}
					color="#808080"
					style={styles.headerImage}
				/>
			}
		>
			<View className="px-6 pt-8">
				<ThemedText className="text-3xl font-bold text-white">
					Business Setup
				</ThemedText>
				<ThemedText className="text-lg text-indigo-200 mt-1">
					Complete these steps to activate your business account
				</ThemedText>

				<View className="space-y-4 mt-8 flex-col gap-4">
					{remainingSteps.map((step) => (
						<AccountButton
							key={step.id}
							handlePress={() => handleStepPress(step.route, step.id)}
							title={step.title}
							subTitle={step.subTitle}
							Icon={step.icon}
						/>
					))}
				</View>
			</View>
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	headerImage: {
		color: '#808080',
		bottom: -90,
		left: -35,
		position: 'absolute',
	},
});
