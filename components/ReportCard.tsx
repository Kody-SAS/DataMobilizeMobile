import { Image, View, StyleSheet, Touchable, TouchableOpacityProps, TouchableOpacity } from "react-native";
import { TextBlock } from "./TextBlock";
import { Spacer } from "./Spacer";
import { TextBlockTypeEnum } from "../type";

type ReportCardProps = TouchableOpacityProps & {
    imageUrl: string;
    title: string;
}
export const ReportCard = ({imageUrl, title, onPress}: ReportCardProps) => {
    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={onPress}>
            <View style={styles.imageContainer}>
                <Image 
                    source={require(imageUrl)}
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
        width: 120,
        height: 110,
        padding: 8,
        justifyContent: "center",
        alignItems: "center"
    },
    imageContainer: {
        borderRadius: 4,
        backgroundColor: "#EBEDF0",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        width: 70,
        height: 100
    },
    image: {
        width: 65,
        height: 65
    },
})