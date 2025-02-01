import { Image, View, StyleSheet, Touchable, TouchableOpacityProps, TouchableOpacity } from "react-native";
import { TextBlock } from "./TextBlock";
import { Spacer } from "./Spacer";
import { TextBlockTypeEnum } from "../type.d";

type MoreOptionCardProps = TouchableOpacityProps & {
    imageUrl: any;
    title: string;
}
export const MoreOptionCard = ({imageUrl, title, onPress}: MoreOptionCardProps) => {
    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={onPress}>
            <View style={styles.imageContainer}>
                <Image 
                    source={imageUrl}
                    style={styles.image}
                    resizeMode="contain" />
            </View>
            <Spacer variant="medium" />
            <TextBlock type={TextBlockTypeEnum.title} style={{textAlign: 'center', flexWrap: 'wrap'}}>{title}</TextBlock>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "transparent",
        width: 110,
        height: 110,
        padding: 4,
        alignItems: "center"
    },
    imageContainer: {
        borderRadius: 45,
        backgroundColor: "#EBEDF0",
        justifyContent: "center",
        alignItems: "center",
        width: 70,
        height: 70,
    },
    image: {
        width: 35,
        height: 35
    },
})