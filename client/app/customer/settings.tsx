import React from 'react';
import {
	View,
	ScrollView,
} from 'react-native';
import { RelativePathString, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import AccountButton from '@/components/AccountButton';


export default function SettingsPage() {
	const router = useRouter();

	const pages = [
		{
			id: 'payment',
			title: 'Change payment details',
			subTitle: 'Update your payment details for transactions',
			icon: (
				<MaterialIcons name="account-balance-wallet" size={42} color="white" />
			),
			route: '/customer/add-payment',
		},
		{
			id: 'details',
			title: 'Update Customer Details',
			subTitle:
				'Edit your customer details',
			icon: <MaterialIcons name="person" size={42} color="white" />,
			route: '/customer/update-customer',
		},
	];

	const handleStepPress = (route: RelativePathString) => {
		router.push({ pathname: route });
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
					</View>
				</ScrollView>
			</View>
		</ParallaxScrollView>
	);
}
