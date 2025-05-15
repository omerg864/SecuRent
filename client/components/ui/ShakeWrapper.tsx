import { Animated, ViewStyle } from "react-native";
import { ReactNode, useRef, useImperativeHandle, forwardRef } from "react";

export type ShakeWrapperRef = {
    triggerShake: () => void;
};

type Props = {
    children: ReactNode;
    style?: ViewStyle;
};

const ShakeWrapper = forwardRef<ShakeWrapperRef, Props>(
    ({ children, style }, ref) => {
        const shakeAnim = useRef(new Animated.Value(0)).current;

        const triggerShake = () => {
            Animated.sequence([
                Animated.timing(shakeAnim, {
                    toValue: 8,
                    duration: 50,
                    useNativeDriver: true
                }),
                Animated.timing(shakeAnim, {
                    toValue: -8,
                    duration: 50,
                    useNativeDriver: true
                }),
                Animated.timing(shakeAnim, {
                    toValue: 6,
                    duration: 50,
                    useNativeDriver: true
                }),
                Animated.timing(shakeAnim, {
                    toValue: -6,
                    duration: 50,
                    useNativeDriver: true
                }),
                Animated.timing(shakeAnim, {
                    toValue: 0,
                    duration: 50,
                    useNativeDriver: true
                })
            ]).start();
        };

        useImperativeHandle(ref, () => ({ triggerShake }));

        return (
            <Animated.View
                style={[{ transform: [{ translateX: shakeAnim }] }, style]}
            >
                {children}
            </Animated.View>
        );
    }
);

export default ShakeWrapper;
