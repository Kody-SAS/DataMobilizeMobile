import { ReactNode } from "react"
import { Button, StyleSheet, TouchableOpacity, TouchableOpacityProps, useColorScheme } from "react-native"
import { ButtonTypeEnum } from "../type.d"
import { Colors } from "../constants/Colors"

type ButtonActionProps = TouchableOpacityProps & {
    variant: ButtonTypeEnum,
    content: ReactNode
}

export const ButtonAction = ({
    style,
    variant,
    content,
    onPress,
    disabled,
    ...rest
}: ButtonActionProps) => {
    //const theme = useColorScheme() ?? 'light';
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[
                variant == ButtonTypeEnum.primary ? styles.primary : undefined,
                variant == ButtonTypeEnum.secondary ? styles.secondary : undefined,
                variant == ButtonTypeEnum.tertiary ? styles.tertiary : undefined,
                variant == ButtonTypeEnum.quarternary ? styles.quarternary : undefined,
                disabled ? { opacity: 0.6 } : undefined,
                style
            ]}
            {...rest}
        >
            {content}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    primary: {
        borderRadius: 8,
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.light.background.primary
    },
    secondary: {
        borderRadius: 8,
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.light.background.secondary
    },
    tertiary: {
        borderRadius: 8,
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.light.background.tertiary
    },
    quarternary: {
        justifyContent: "center",
        alignItems: "center",
        color: Colors.light.background.primary
    }
})