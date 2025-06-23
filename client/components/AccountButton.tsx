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
	buttonBackground?: string;
	descriptionColor?: string;
	isSettings?: boolean;
}
const AccountButton = ({
	handlePress,
	title,
	subTitle,
	Icon,
	buttonBackground = 'bg-indigo-600/30',
	descriptionColor = Colors.light.icon,
	isSettings = false,
}: AccountProps) => {
	return (
		<HapticButton
			onPress={handlePress}
			className={`p-6 pt-10 pb-10 rounded-2xl active:opacity-90 ${buttonBackground}`}
		>
			<View className="flex-row justify-between items-center">
				<View className="flex-1">
					<ThemedText className="text-xl font-semibold text-white"
						style={{ color: isSettings ? 'white' : Colors.light.text }}
					>
						{title}
					</ThemedText>
					<ThemedText
						className="mt-1"
						style={{ color: descriptionColor }}
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
