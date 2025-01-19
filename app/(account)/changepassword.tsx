import { View, StyleSheet, ScrollView } from "react-native";
import { TextBlock } from "../../components/TextBlock";
import { Colors } from "../../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useTranslation } from "react-i18next";
import { useNetInfo } from "@react-native-community/netinfo";
import { useDispatch, useSelector } from "react-redux";
import ToastMessage from "../../utils/Toast";
import { TextInput } from "react-native-paper";
import { ButtonTypeEnum, FontsEnum, FontSizesEnum, ForgotUser, TextBlockTypeEnum } from "../../type";
import { Spacer } from "../../components/Spacer";
import { ButtonAction } from "../../components/ButtonAction";
import { changePassword, selectForgotUser } from "../../redux/slices/accountSlice";
import { router } from "expo-router";

export default function ChangePassword() {
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const {isConnected} = useNetInfo();
    const {t} = useTranslation();
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const forgotUser: ForgotUser = useSelector(selectForgotUser);

    const handleChangePassword = () => {
        // for testing
        // router.push("/(tabs)/")
        // return;
        if (!isConnected) {
            ToastMessage("error", t("error"), t("connectAndTryAgain"));
            return;
        }

        if (!password || !confirmPassword) {
            setErrorMessage(t("fillAllFields"));
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage(t("passwordDismatch"));
            return;
        }

        setErrorMessage("");

        dispatch(changePassword({
            userId: forgotUser.userId,
            password
        }))
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Spacer variant="large" />
                <TextBlock type={TextBlockTypeEnum.body} style={{ textAlign: "center" }}>
                    {t("provideNewPassword")}
                </TextBlock>
                <Spacer variant="large" />
                <Spacer variant="medium" />
                <TextInput
                    mode="outlined"
                    value={password}
                    onChangeText={(t) => setPassword(t)}
                    contentStyle={{
                        fontSize: FontSizesEnum.body,
                        fontFamily: FontsEnum.body,
                    }}
                    activeOutlineColor={Colors.light.background.primary}
                    secureTextEntry
                    placeholder={t("password")}
                    placeholderTextColor={Colors.light.text.secondary}
                />
                <Spacer variant="large" />

                <TextInput
                    mode="outlined"
                    value={confirmPassword}
                    onChangeText={(t) => setConfirmPassword(t)}
                    contentStyle={{
                        fontSize: FontSizesEnum.body,
                        fontFamily: FontsEnum.body,
                    }}
                    activeOutlineColor={Colors.light.background.primary}
                    secureTextEntry
                    placeholder={t("confirmPassword")}
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
                    onPress={handleChangePassword}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background.quaternary,
        borderRadius: 10,
        paddingHorizontal: 16
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