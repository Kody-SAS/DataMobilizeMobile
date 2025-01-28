import { View, StyleSheet, ScrollView } from "react-native";
import { TextBlock } from "../../components/TextBlock";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";
import { Spacer } from "../../components/Spacer";
import { ButtonTypeEnum, FontsEnum, FontSizesEnum, TextBlockTypeEnum } from "../../type.d";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { sendForgotPasswordCode } from "../../redux/slices/accountSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { TextInput } from "react-native-paper";
import { ButtonAction } from "../../components/ButtonAction";
import { router } from "expo-router";
import ToastMessage from "../../utils/Toast";
import { useNetInfo } from "@react-native-community/netinfo";

export default function Forgot() {
    const [email, setEmail] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const {isConnected} = useNetInfo();
    const {t} = useTranslation();
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

    const handleSendVerificationCode = () => {
        // for testing
        // router.push("/(tabs)/");
        // return;
        if (!isConnected) {
            ToastMessage("error", t("error"), t("connectAndTryAgain"));
            return;
        }
        if (!email) {
            setErrorMessage(t("fillTheField"));
            return;
        }

        setErrorMessage("");
        dispatch(sendForgotPasswordCode(email));
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <TextBlock type={TextBlockTypeEnum.body} style={{ textAlign: "center" }}>
                    {t("provideEmailForgot")}
                </TextBlock>
                <Spacer variant="large" />
                <Spacer variant="medium" />
                <TextInput
                    mode="outlined"
                    value={email}
                    onChangeText={(t) => setEmail(t)}
                    contentStyle={{
                        fontSize: FontSizesEnum.body,
                        fontFamily: FontsEnum.body,
                    }}
                    activeOutlineColor={Colors.light.background.primary}
                    keyboardType="email-address"
                    placeholder={t("emailPlaceholder")}
                    placeholderTextColor={Colors.light.text.secondary}
                />
                <Spacer variant="large" />

                {errorMessage.length > 0 && (
                                <View>
                                    <TextBlock type={TextBlockTypeEnum.caption} style={{ color: "red" }}>
                                        {errorMessage}
                                    </TextBlock>
                                    <Spacer variant="medium" />
                                </View>
                        )}
                <ButtonAction
                    variant={ButtonTypeEnum.primary}
                    content={
                        <TextBlock type={TextBlockTypeEnum.body} style={styles.description}>
                            {t("continue")}
                        </TextBlock>}
                    onPress={handleSendVerificationCode}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background.quinary,
        padding: 16
    },
    description: {
        verticalAlign: "middle",
        color: "#FFFFFF",
        paddingHorizontal: 32,
        paddingVertical: 4,
        justifyContent: "center",
        alignItems: "center"
    },
})