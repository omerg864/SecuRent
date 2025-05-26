import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset
} from "react-native-reanimated";

import { ThemedView } from "@/components/ui/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import HapticButton from "@/components/ui/HapticButton";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_HEIGHT = 200;

type Props = PropsWithChildren<{
    headerImage: ReactElement;
    headerBackgroundColor: { dark: string; light: string };
    onBack?: () => void;
    topOverlayContent?: ReactElement;
}>;

export default function ParallaxScrollView({
    children,
    headerImage,
    headerBackgroundColor,
    onBack,
    topOverlayContent
}: Props) {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme() ?? "light";
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                        [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
                    )
                },
                {
                    scale: interpolate(
                        scrollOffset.value,
                        [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                        [2, 1, 1]
                    )
                }
            ]
        };
    });

    return (
        <ThemedView className='flex-1'>
            <Animated.ScrollView
                style={{ flex: 1, height: "100%" }}
                ref={scrollRef}
                scrollEventThrottle={16}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <Animated.View
                    style={[
                        styles.header,
                        { backgroundColor: headerBackgroundColor[colorScheme] },
                        headerAnimatedStyle
                    ]}
                >
                    {headerImage}

                    {topOverlayContent && (
                        <View
                            style={{
                                position: "absolute",
                                top: insets.top - 30,
                                right: 12
                            }}
                        >
                            {topOverlayContent}
                        </View>
                    )}

                    {onBack && (
                        <HapticButton
                            onPress={onBack}
                            className='absolute w-12 h-12 rounded-full bg-gray-100 justify-center items-center'
                            style={{ top: insets.top - 30, left: 12 }}
                        >
                            <Ionicons
                                name='arrow-back'
                                size={24}
                                color='black'
                            />
                        </HapticButton>
                    )}
                </Animated.View>

                <ThemedView className='flex-1'>{children}</ThemedView>
            </Animated.ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    header: {
        height: HEADER_HEIGHT,
        overflow: "hidden",
        position: "relative"
    }
});
