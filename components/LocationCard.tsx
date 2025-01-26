import { View, StyleSheet } from "react-native"
import { TextBlock } from "./TextBlock"
import { useTranslation } from "react-i18next";
import { ButtonAction } from "./ButtonAction";
import { ButtonTypeEnum, TextBlockTypeEnum } from "../type";
import { Spacer } from "./Spacer";
import MapView from "react-native-maps";

export const LocationCard = () => {
    const {t} = useTranslation();
    const handleMapNavigation = () => {

    }
    return (
        <View>
            <View style={styles.header}>
                <TextBlock>{t("yourLocation")}</TextBlock>
                <ButtonAction
                    onPress={handleMapNavigation}
                    variant={ButtonTypeEnum.quarternary}
                    content={
                        <TextBlock type={TextBlockTypeEnum.body}>{t("viewOnMap")}</TextBlock>
                    }
                    />
            </View>
            <Spacer variant="medium" />
            <MapView style={styles.map}/>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    map: {
        width: "100%",
        height: 140
    }
})