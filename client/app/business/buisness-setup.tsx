import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import { ThemedText } from '@/components/ui/ThemedText';
import AccountButton from '@/components/AccountButton';
import { MaterialCommunityIcons, MaterialIcons, Entypo } from '@expo/vector-icons';

const BusinessSetupSteps: {
	id: string;
	title: string;
	subTitle: string;
	icon: JSX.Element;
	route: "/business/verify-email" | "/business/bank-details" | "/business/verification" | "/business/buisness-home";
}[] = [
	{
		id: "email",
		title: "Verify your email address",
		subTitle: "Confirm your email to secure your account",
		icon: <MaterialCommunityIcons name="email-check" size={42} color="white" />,
		route: "/business/verify-email",
	},
	{
		id: "bank",
		title: "Add Bank Details",
		subTitle: "Link your bank account for transactions",
		icon: <MaterialIcons name="account-balance" size={42} color="white" />,
		route: "/business/bank-details",
	},
	{
		id: "verification",
		title: "Business Verification",
		subTitle: "Complete verification to activate your business account",
		icon: <Entypo name="briefcase" size={42} color="white" />,
		route: "/business/verification",
	},
	{
		id: "home",
		title: "Business Home",
		subTitle: "Go to your business home page",
		icon: <Entypo name="home" size={42} color="white" />,
		route: "/business/buisness-home",
	},
];

export default function BusinessSetupScreen() {
	const router = useRouter();

	const handleStepPress = (route: "/business/verify-email" | "/business/bank-details" | "/business/verification" | "/business/buisness-home") => {
		router.push(route); // ✅ Now TypeScript correctly recognizes `route` as a valid option.
	};

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
					{BusinessSetupSteps.map((step) => (
						<AccountButton
							key={step.id}
							handlePress={() => handleStepPress(step.route)}
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
