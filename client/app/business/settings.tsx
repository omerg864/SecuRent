import React, { useState } from 'react';
import {
	View,
	Alert,
	ScrollView,
	Modal,
	Text,
	ActivityIndicator,
} from 'react-native';
import { RelativePathString, useRouter } from 'expo-router';
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import AccountButton from '@/components/AccountButton';
import HapticButton from '@/components/ui/HapticButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { useBusiness } from '@/context/BusinessContext';
import ShowToast from '@/components/ui/ShowToast';
import { toggleActivation } from '@/services/businessService';

export default function SettingsPage() {
	const router = useRouter();
	const [modalVisible, setModalVisible] = useState(false);
	const { business, updateBusiness } = useBusiness();
	const [isLoading, setIsLoading] = useState(false);

	const pages = [
		{
			id: 'bank',
			title: 'Edit Bank Details',
			subTitle: 'Edit your bank details through Stripe',
			icon: (
				<MaterialIcons name="account-balance" size={42} color="white" />
			),
			route: '/business/bank-details',
		},
		{
			id: 'details',
			title: 'Business Details',
			subTitle:
				'Edit your business details like name, address, and contact info',
			icon: <Entypo name="briefcase" size={42} color="white" />,
			route: '/business/business-details',
		},
	];

	const handleStepPress = (route: RelativePathString) => {
		router.push({ pathname: route });
	};

	const handleToggleActivation = async () => {
		setIsLoading(true);
		setModalVisible(false);
		try {
			const data = await toggleActivation();
			if (data.success) {
				ShowToast(
					'success',
					`Account ${
						data.activated ? 'activated' : 'deactivated'
					} successfully`
				);
				updateBusiness({
					activated: data.activated,
				});
			}
		} catch (error: any) {
			ShowToast('error', error.response?.data.message || 'Update failed');
		}
		setIsLoading(false);
	};

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#D0D0D0', dark: '#D0D0D0' }}
			headerImage={
				<Ionicons
					name="settings"
					size={250}
					color="#808080"
					style={{ position: 'absolute', bottom: -90, left: -35 }}
				/>
			}
		>
			<View className="flex-1 bg-white">
				<ScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					className="flex-1 bg-white"
				>
					<View className="flex-1 justify-between px-6 pt-6 pb-12">
						<View className="gap-4">
							{pages.map((page) => (
								<AccountButton
									key={page.id}
									handlePress={() =>
										handleStepPress(
											page.route as RelativePathString
										)
									}
									buttonBackground="bg-indigo-600"
									descriptionColor="white"
									title={page.title}
									subTitle={page.subTitle}
									Icon={page.icon}
									isSettings={true}
								/>
							))}
						</View>

						<HapticButton
							className={`mt-6 ${
								!business?.activated
									? 'bg-green-600'
									: 'bg-red-600'
							} rounded-full py-4 items-center shadow-lg`}
							onPress={() => setModalVisible(true)}
						>
							<ThemedText className="text-white font-semibold text-lg">
								{!business?.activated
									? 'Activate Account'
									: 'Deactivate Account'}
							</ThemedText>
						</HapticButton>
					</View>
				</ScrollView>
			</View>

			{/* Modal for confirmation */}
			<Modal
				visible={modalVisible}
				transparent
				animationType="slide"
				onRequestClose={() => setModalVisible(false)}
			>
				<View className="flex-1 justify-center items-center bg-black/60 px-6">
					<View className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
						<Text className="text-lg font-semibold mb-4 text-center">
							{!business?.activated
								? 'Activate your account?'
								: 'Deactivate your account?'}
						</Text>

						{business?.activated ? (
							<>
								<Text className="text-center mb-4">
									This will remove your business from the
									platform and prevent new transactions from
									being open
								</Text>

								<Text className="text-gray-600 text-center mb-4">
									*If you have open transactions, you cannot
									deactivate your account.
								</Text>
								<Text className="text-gray-600 text-center mb-4">
									*You can reactivate your account at any
									time.
								</Text>
							</>
						) : (
							<>
								<Text className="text-gray-600 text-center mb-4">
									This will reactivate you account and allow
									new transactions to be open.
								</Text>
							</>
						)}

						<View className="flex-row justify-end gap-4">
							<HapticButton
								className="px-4 py-2 bg-gray-300 rounded-lg"
								onPress={() => setModalVisible(false)}
							>
								<Text className="text-gray-800">Cancel</Text>
							</HapticButton>
							<HapticButton
								className={`px-4 py-2 rounded-lg ${
									!business?.activated
										? 'bg-green-600'
										: 'bg-red-600'
								}`}
								onPress={handleToggleActivation}
							>
								<Text className="text-white">
									{isLoading ? (
										<ActivityIndicator color="#fff" />
									) : !business?.activated ? (
										'Activate'
									) : (
										'Deactivate'
									)}
								</Text>
							</HapticButton>
						</View>
					</View>
				</View>
			</Modal>
		</ParallaxScrollView>
	);
}
