import { View, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextBlock } from "../../components/TextBlock";
import { TextBlockTypeEnum } from "../../type";
import { Spacer } from "../../components/Spacer";
import { useTranslation } from "react-i18next";

export default function Login() {
    const {t} = useTranslation();

    return (
        <SafeAreaView style={styles.container}>
            <TextBlock type={TextBlockTypeEnum.h1} style={{ textAlign: "center" }}>
                DataMobilize
            </TextBlock>
            <Spacer variant="large" />
            <Spacer variant="large" />
            <TextBlock type={TextBlockTypeEnum.h3} style={{ textAlign: "center" }}>
                {t("welcomeBack")}
            </TextBlock>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background.quinary,
        padding: 16
    },
    logo: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: 40,
        width: 80,
    },
    accountCreate: {
        width: "100%",
        height: 140
    }
})