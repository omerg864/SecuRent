import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface StarProps {
	fill: number; // value from 0 to 1
	size?: number;
}

const Star: React.FC<StarProps> = ({ fill, size = 24 }) => {
	const fillWidth = size * fill;

	return (
		<View style={{ width: size, height: size }}>
			{/* Background empty star */}
			<Svg width={size} height={size} viewBox="0 0 24 24">
				<Path
					d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
					fill="#E0E0E0" // empty color
				/>
			</Svg>

			{/* Filled star on top */}
			<View
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: fillWidth,
					overflow: 'hidden',
				}}
			>
				<Svg width={size} height={size} viewBox="0 0 24 24">
					<Path
						d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
						fill="#FFD700" // filled color
					/>
				</Svg>
			</View>
		</View>
	);
};

export default Star;