import { StyleSheet, View, ViewProps } from "react-native"

type SpacerProps = ViewProps & {
    variant: "small" | "medium" | "large",
    position?: "top" | "bottom" | "left" | "right"
}
export const Spacer = ({style, variant, position = "bottom", ...rest}: SpacerProps) => {
    return (
        <View style={[
            style,
            position == null ? {marginBottom: variant == "small" ? 4 : (variant == "medium" ? 8 : 16)} : undefined,
            position == "top" ? {marginTop: variant == "small" ? 4 : (variant == "medium" ? 8 : 16)} : undefined,
            position == "bottom" ? {marginBottom: variant == "small" ? 4 : (variant == "medium" ? 8 : 16)} : undefined,
            position == "left" ? {marginLeft: variant == "small" ? 4 : (variant == "medium" ? 8 : 16)} : undefined,
            position == "right" ? {marginRight: variant == "small" ? 4 : (variant == "medium" ? 8 : 16)} : undefined,
        ]} />
    )
}

