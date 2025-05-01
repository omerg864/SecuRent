import React from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router, RelativePathString } from 'expo-router';
import HapticButton from './HapticButton';

type FloatingBackArrowButtonProps = {
	from?: RelativePathString;
};

const FloatingBackArrowButton: React.FC<FloatingBackArrowButtonProps> = ({
	from,
}) => {
	return (
		<View className="absolute top-20 left-5 z-10">
			<HapticButton
				onPress={() =>
					from
						? router.replace({
								pathname: from as RelativePathString,
						  })
						: router.back()
				}
				className="bg-white p-2 rounded-full shadow-md"
			>
				<Feather name="arrow-left" size={24} color="black" />
			</HapticButton>
		</View>
	);
};

export default FloatingBackArrowButton;
