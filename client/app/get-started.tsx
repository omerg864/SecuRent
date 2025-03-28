import { View, StyleSheet } from 'react-native';
import HapticButton from '@/components/ui/HapticButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AccountButton from '@/components/AccountButton';

const GetStartedScreen = () => {
	const router = useRouter();

	const onBack = () => {
		router.back();
	};

	const handleBusiness = () => {
		router.push({
			pathname: '/register',
			params: { accountType: 'business' },
		});
	};

	const handlePersonal = () => {
		router.push({  
			pathname: '/register',
			params: { accountType: 'personal' },
		});
	};

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
			onBack={onBack}
			headerImage={
				<MaterialCommunityIcons
					name="target-account"
					size={250}
					color="#808080"
					style={styles.headerImage}
				/>
			}
		>
			<View className="px-6 pt-8">
				<ThemedText className="text-3xl font-bold text-white">
					Get started
				</ThemedText>
				<ThemedText className="text-lg text-indigo-200 mt-1">
					Get most out of your SecuRent account
				</ThemedText>

				<View className="space-y-4 mt-8 flex-col gap-4">
					<AccountButton
						handlePress={handleBusiness}
						title="Business account"
						subTitle="Create an account for your business"
						Icon={
							<MaterialIcons
								name="business-center"
								size={42}
								color="white"
							/>
						}
					/>

					<AccountButton
						handlePress={handlePersonal}
						title="Personal account"
						subTitle="Create an account for yourself"
						Icon={<Entypo name="user" size={42} color="white" />}
					/>
				</View>
			</View>
		</ParallaxScrollView>
	);
};

export default GetStartedScreen;

const styles = StyleSheet.create({
	headerImage: {
		color: '#808080',
		bottom: -90,
		left: -35,
		position: 'absolute',
	},
});
