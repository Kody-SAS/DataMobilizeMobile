import { Image, StyleSheet, useColorScheme, View } from "react-native";
import { Spacer } from "../../components/Spacer";
import { TextBlock } from "../../components/TextBlock";
import { useTranslation } from "react-i18next";
import { ButtonAction } from "../../components/ButtonAction";
import { ButtonTypeEnum, TextBlockTypeEnum } from "../../type";
import { Colors } from "../../constants/Colors";
import { useDispatch } from "react-redux";
import { setOnboardingStatus } from "../../redux/slices/onboardingSlice";
import { router } from "expo-router";

export default function onboarding() {
    // translate text
    const { t } = useTranslation();
    const theme = useColorScheme() ?? "light";
    const dispatch = useDispatch()

    const finishOnboarding = () => {
        dispatch(setOnboardingStatus());

        router.replace("/(account)")
    }

    return (
        <View style={styles.container}>
            
            <Spacer position="bottom" variant="large" />
            
            <Image 
                source={require("../../assets/images/onboarding.jpg")}
                style={styles.illustration}
                resizeMode="center"
            />
            <TextBlock type={TextBlockTypeEnum.h1} style={{textAlign: "center", color: "#898989"}}>
                DATA MOBILIZE
            </TextBlock>
            <Spacer position="bottom" variant="large" />
            <Spacer position="bottom" variant="medium" />
            <TextBlock type={TextBlockTypeEnum.h4} style={{textAlign: "center"}}>
                {t("onboardingMessage")}
            </TextBlock>
            <Spacer position="bottom" variant="large" />
            <Spacer position="bottom" variant="large" />
            <Spacer position="bottom" variant="large" />
            <ButtonAction 
                onPress={finishOnboarding}
                variant={ButtonTypeEnum.primary}
                content={
                    <TextBlock type={TextBlockTypeEnum.h4} style={styles.description}>
                        {t("start")}
                    </TextBlock>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.light.background.quinary
    },
    illustration: {
        width: "100%",
        height: 400,
    },
    description: {
        verticalAlign: "middle",
        color: Colors.light.background.quinary,
        paddingHorizontal: 96,
        paddingVertical: 4
    }
})