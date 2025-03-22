import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

interface StarRatingProps {
	rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
	return (
		<View className="flex-row">
			{[1, 2, 3, 4, 5].map((star) => (
				<FontAwesome
					key={star}
					name="star"
					size={20}
					color={star <= rating ? '#FFD700' : '#E0E0E0'}
				/>
			))}
		</View>
	);
};

export default StarRating;
