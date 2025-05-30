import React from "react";

interface StarRatingProps {
    rating: number; 
    maxStars?: number;
    size?: number; 
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxStars = 5,
    size = 20
}) => {
    return (
        <div style={{ display: "flex", gap: 4 }}>
            {[...Array(maxStars)].map((_, i) => {
                const fillLevel = Math.max(0, Math.min(1, rating - i)); // between 0 and 1
                return (
                    <div
                        key={i}
                        style={{
                            position: "relative",
                            width: size,
                            height: size
                        }}
                    >
                        {/* Empty star */}
                        <svg
                            viewBox='0 0 20 20'
                            fill='currentColor'
                            style={{
                                width: size,
                                height: size,
                                color: "#e5e7eb" /* gray-300 */
                            }}
                        >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                        </svg>

                        {/* Filled star */}
                        <div
                            style={{
                                width: `${fillLevel * 100}%`,
                                overflow: "hidden",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                height: size
                            }}
                        >
                            <svg
                                viewBox='0 0 20 20'
                                fill='currentColor'
                                style={{
                                    width: size,
                                    height: size,
                                    color: "#facc15" /* yellow-400 */
                                }}
                            >
                                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                            </svg>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StarRating;
