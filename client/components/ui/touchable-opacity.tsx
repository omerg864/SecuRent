import { TouchableOpacity as RNTouchableOpacity, type TouchableOpacityProps } from "react-native"

export function TouchableOpacity({ style, activeOpacity = 0.7, ...props }: TouchableOpacityProps) {
  return <RNTouchableOpacity activeOpacity={activeOpacity} style={style} {...props} />
}

