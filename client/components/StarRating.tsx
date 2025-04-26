import React from 'react';
import { View } from 'react-native';
import Star from './Star';

interface StarRatingProps {
	rating: number;
	size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 22 }) => {
	return (
		<View style={{ flexDirection: 'row' }}>
			{[0, 1, 2, 3, 4].map((index) => {
				const currentStarRating = Math.min(
					Math.max(rating - index, 0),
					1
				);
				return (
					<Star key={index} fill={currentStarRating} size={size} />
				);
			})}
		</View>
	);
};

export default StarRating;
