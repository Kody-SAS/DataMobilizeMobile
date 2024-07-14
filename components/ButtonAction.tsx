import { ReactNode } from "react"
import { Button, StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"

type ButtonActionProps = TouchableOpacityProps & {
    variant: ButtonTypeEnum,
    content: ReactNode
}

export const ButtonAction = ({
    style,
    variant,
    content,
    onPress,
    ...rest
}: ButtonActionProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                style,
                variant == "primary" ? styles.primary : undefined,
                variant == "secondary" ? styles.secondary : undefined,
                variant == "tertiary" ? styles.tertiary : undefined
            ]}
            {...rest}
        >
            {content}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    primary: {

    },
    secondary: {

    },
    tertiary: {

    }
})