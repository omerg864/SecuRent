import HapticButton from '@/components/ui/HapticButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { View } from 'react-native';
import { ReactElement } from 'react';

interface AccountProps {
	handlePress: () => void;
	title: string;
	subTitle: string;
	Icon: ReactElement;
}
const AccountButton = ({
	handlePress,
	title,
	subTitle,
	Icon,
}: AccountProps) => {
	return (
		<HapticButton
			onPress={handlePress}
			className="bg-indigo-600/30 p-6 pt-10 pb-10 rounded-2xl active:opacity-90"
		>
			<View className="flex-row justify-between items-center">
				<View className="flex-1">
					<ThemedText className="text-xl font-semibold text-white">
						{title}
					</ThemedText>
					<ThemedText
						className="mt-1"
						style={{ color: Colors.light.icon }}
					>
						{subTitle}
					</ThemedText>
				</View>
				{Icon}
			</View>
		</HapticButton>
	);
};

export default AccountButton;
