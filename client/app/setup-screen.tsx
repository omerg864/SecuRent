'use client';

import { View, StyleSheet } from 'react-native';
import {
	type Route,
	useRouter,
	useLocalSearchParams,
	RelativePathString,
} from 'expo-router';
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import { ThemedText } from '@/components/ui/ThemedText';
import AccountButton from '@/components/AccountButton';
import {
	MaterialCommunityIcons,
	MaterialIcons,
	Entypo,
} from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
	ACCOUNT_SETUP,
	COMPLETED_STEPS,
	CURRENT_ACCOUNT_TYPE,
} from '@/utils/asyncStorageConstants';

const BusinessSetupSteps = [
	{
		id: 'email',
		title: 'Verify your email address',
		subTitle: 'Confirm your email to secure your account',
		icon: (
			<MaterialCommunityIcons
				name="email-check"
				size={42}
				color="white"
			/>
		),
		route: '/verify-email',
	},
	{
		id: 'bank',
		title: 'Add Bank Details',
		subTitle: 'Link your bank account for transactions',
		icon: <MaterialIcons name="account-balance" size={42} color="white" />,
		route: '/bank-details',
	},
	{
		id: 'verification',
		title: 'Business Details',
		subTitle: 'Complete business details to activate your business account',
		icon: <Entypo name="briefcase" size={42} color="white" />,
		route: '/verification',
	},
];

const CustomerSetupSteps = [
	{
		id: 'email',
		title: 'Verify your email address',
		subTitle: 'Confirm your email to secure your account',
		icon: (
			<MaterialCommunityIcons
				name="email-check"
				size={42}
				color="white"
			/>
		),
		route: '/verify-email',
	},
	{
		id: 'payment',
		title: 'Add Payment Method',
		subTitle: 'This is the payment method for the deposit.',
		icon: (
			<MaterialIcons
				name="account-balance-wallet"
				size={42}
				color="white"
			/>
		),
		route: '/add-payment',
	},
];

export default function SetupScreen() {
	const router = useRouter();
	const params = useLocalSearchParams();
	const [completedSteps, setCompletedSteps] = useState<string[]>([]);
	const [accountType, setAccountType] = useState<string>('business');

	useFocusEffect(
		useCallback(() => {
			const loadData = async () => {
				try {
					let currentAccountType = params.accountType as string;

					if (!currentAccountType) {
						const savedAccountType = await AsyncStorage.getItem(
							CURRENT_ACCOUNT_TYPE
						);
						currentAccountType = savedAccountType || 'business';
					} else {
						await AsyncStorage.setItem(
							CURRENT_ACCOUNT_TYPE,
							currentAccountType
						);
					}

					setAccountType(currentAccountType);

					const storageKey = `completedSteps_${currentAccountType}`;
					const savedSteps = await AsyncStorage.getItem(storageKey);

					if (savedSteps) {
						const parsedSteps = JSON.parse(savedSteps);
						setCompletedSteps(parsedSteps);
					} else {
						setCompletedSteps([]);
					}
				} catch (error) {
					console.error('Error loading data:', error);
					setCompletedSteps([]);
				}
			};

			loadData();
		}, [params])
	);

	const steps =
		accountType === 'personal' ? CustomerSetupSteps : BusinessSetupSteps;

	const remainingSteps = steps.filter(
		(step) => !completedSteps.includes(step.id)
	);

	useFocusEffect(
		useCallback(() => {
			if (remainingSteps.length === 0 && completedSteps.length > 0) {
				AsyncStorage.removeItem(`${COMPLETED_STEPS}_${accountType}`);
				AsyncStorage.removeItem(accountType);
				AsyncStorage.removeItem(ACCOUNT_SETUP);
				const homeRoute =
					accountType === 'personal'
						? '/customer'
						: '/business/business-home';
				router.dismissAll();
				router.replace(homeRoute);
			}
		}, [remainingSteps.length, completedSteps.length, accountType])
	);

	const handleStepPress = async (route: RelativePathString) => {
		await AsyncStorage.setItem(CURRENT_ACCOUNT_TYPE, accountType);

		router.push({
			pathname: route,
			params: { accountType },
		});
	};

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
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
					{accountType === 'personal'
						? 'Personal Account Setup'
						: 'Business Setup'}
				</ThemedText>
				<ThemedText className="text-lg text-indigo-200 mt-1">
					{accountType === 'personal'
						? 'Complete these steps to activate your personal account'
						: 'Complete these steps to activate your business account'}
				</ThemedText>

				<View className="space-y-4 mt-8 flex-col gap-4">
					{remainingSteps.map((step) => (
						<AccountButton
							key={step.id}
							handlePress={() =>
								handleStepPress(
									step.route as RelativePathString
								)
							}
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
