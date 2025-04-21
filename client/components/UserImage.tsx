import { Image, View } from 'react-native';
import { Text } from './ui/text';

interface UserImageProps {
	image?: string | null | undefined;
	name?: string | null | undefined;
	size?: number;
	className?: string;
	onPress?: () => void;
}
const UserImage = ({
	image,
	name,
	size,
	className,
	onPress,
}: UserImageProps) => {
	return (
		<>
			{image ? (
				<Image
					src={image}
					className={`w-${size || 16} h-${
						size || 16
					} rounded-full mr-4`}
				/>
			) : (
				<View
					className={`w-${size || 16} h-${
						size || 16
					} rounded-full bg-blue-100 items-center justify-center mb-2 ${className}`}
				>
					<Text className="text-2xl font-bold text-blue-600">
						{name?.[0] || '?'}
					</Text>
				</View>
			)}
		</>
	);
};

export default UserImage;
