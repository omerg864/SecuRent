import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { forwardRef, useRef, useImperativeHandle } from "react";
import ShakeWrapper, { ShakeWrapperRef } from "./ui/ShakeWrapper";

export type TermsAgreementSectionRef = {
    triggerShake: () => void;
};

type Props = {
    hasReadTerms: boolean;
    onToggle: () => void;
};

const TermsAgreementSection = forwardRef<TermsAgreementSectionRef, Props>(
    ({ hasReadTerms, onToggle }, ref) => {
        const internalShakeRef = useRef<ShakeWrapperRef>(null);

        useImperativeHandle(ref, () => ({
            triggerShake: () => internalShakeRef.current?.triggerShake()
        }));

        return (
            <View>
                {/* Section title */}
                <Text className='text-white/80 text-md text-center font-semibold mb-2 mt-6'>
                    Please read and approve before proceeding
                </Text>

                {/* Rental terms content */}
                <ScrollView className='self-center bg-indigo-700/20 border border-white/10 mx-6 p-4 rounded-xl max-h-[80px] max-w-[340px]'>
                    <Text className='leading-8 text-white/90 text-md mb-4'>
                        Rental Terms:
                        {"\n"}1. You must return the item on time.
                        {"\n"}2. Late returns may result in additional charges.
                        {"\n"}3. Damaged items may incur extra fees.
                        {"\n"}4. The business reserves the right to withhold the
                        deposit if necessary.
                    </Text>
                </ScrollView>

                {/* Checkbox and label with shake animation */}
                <ShakeWrapper ref={internalShakeRef}>
                    <View className='flex-row items-center mt-4 px-10'>
                        <TouchableOpacity
                            onPress={onToggle}
                            className='w-5 h-5 border border-white/60 mr-3 items-center justify-center'
                        >
                            {hasReadTerms && (
                                <View className='w-3 h-3 bg-white' />
                            )}
                        </TouchableOpacity>
                        <Text className='text-white/80 text-md font-semibold'>
                            I have read and understood the terms
                        </Text>
                    </View>
                </ShakeWrapper>
            </View>
        );
    }
);

export default TermsAgreementSection;
