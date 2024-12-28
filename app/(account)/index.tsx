import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Colors } from "../../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextBlock } from "../../components/TextBlock";
import { ButtonTypeEnum, FontsEnum, FontSizesEnum, TextBlockTypeEnum } from "../../type.d";
import { Spacer } from "../../components/Spacer";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native-paper";
import { ButtonAction } from "../../components/ButtonAction";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/slices/accountSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import ToastMessage from "../../utils/Toast";
import { useNetInfo } from "@react-native-community/netinfo";
import { router } from "expo-router";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const {isConnected} = useNetInfo();
    const {t} = useTranslation();
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

    const handleLogin = () => {
        if (!isConnected) {
            ToastMessage("error", t("error"), t("connectAndTryAgain"));
            return;
        }
        
        dispatch(loginUser({email, password}));
    }

    const handleNavigationToRegister = () => {
        router.push("/(account)/register");
    }

    const handleSigninWithGoogle = () => {
        ToastMessage("info", t("info"), t("comingSoon"));
    }

    const handleSigninWithApple = () => {
        ToastMessage("info", t("info"), t("comingSoon"));
    }

    return (
        <SafeAreaView style={styles.container}>
            <Spacer variant="large" />
            <Spacer variant="large" />
            <Spacer variant="large" />

            <TextBlock type={TextBlockTypeEnum.h1} style={{ textAlign: "center" }}>
                DataMobilize
            </TextBlock>
            <Spacer variant="large" />
            <Spacer variant="large" />
            <TextBlock type={TextBlockTypeEnum.h3} style={{ textAlign: "center" }}>
                {t("welcomeBack")}
            </TextBlock>
            <TextBlock type={TextBlockTypeEnum.body} style={{ textAlign: "center" }}>
                {t("loginToContinue")}
            </TextBlock>
            <Spacer variant="large" />
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
                placeholder="email@domain.com"
                placeholderTextColor={Colors.light.text.secondary}
            />
            <Spacer variant="large" />

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
            <Spacer variant="large" />
            <ButtonAction
                variant={ButtonTypeEnum.primary}
                content={
                    <TextBlock type={TextBlockTypeEnum.body} style={styles.description}>
                        {t("continue")}
                    </TextBlock>}
                onPress={handleLogin}
            />
            <Spacer variant="large" />
            <Spacer variant="large" />
            <View style={styles.createOption}>
                <TextBlock type={TextBlockTypeEnum.body} style={styles.questionAccount}>
                    {t("noAccountQuestion")}
                </TextBlock>
                <ButtonAction
                    variant={ButtonTypeEnum.tertiary}
                    content={
                        <TextBlock type={TextBlockTypeEnum.body} style={styles.create}>
                            {t("create")}
                        </TextBlock>}
                    onPress={handleNavigationToRegister}
                />
            </View>
            <Spacer variant="large" />
            <Spacer variant="large" />

            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <TextBlock type={TextBlockTypeEnum.body} style={styles.description}>
                    {t("or")}
                </TextBlock>
                <View style={styles.dividerLine} />
            </View>
            <Spacer variant="large" />
            <Spacer variant="large" />
            <ButtonAction
                variant={ButtonTypeEnum.secondary}
                content={
                    <TextBlock type={TextBlockTypeEnum.body} style={styles.description}>
                        {t("continueWithGoogle")}
                    </TextBlock>}
                onPress={handleSigninWithGoogle}
            />
            {
                Platform.OS != "ios" &&
                <>
                    <Spacer variant="medium" />
                    <ButtonAction
                        variant={ButtonTypeEnum.secondary}
                        content={
                            <TextBlock type={TextBlockTypeEnum.body} style={styles.description}>
                                {t("continueWithApple")}
                            </TextBlock>}
                        onPress={handleSigninWithApple}
                    />
                </>
            }
            <Spacer variant="large" />
            <Spacer variant="small" />

            <View style={styles.termsAndPolicy}>
                <TextBlock type={TextBlockTypeEnum.body} style={styles.description}>
                    {t("informTermsAndPolicy")}
                </TextBlock>
                <TextBlock type={TextBlockTypeEnum.body} style={styles.description}>
                    {t("termsOfService")}
                </TextBlock>
                <TextBlock type={TextBlockTypeEnum.body} style={styles.description}>
                    {t("and")}
                </TextBlock>
                <TextBlock type={TextBlockTypeEnum.body} style={styles.description}>
                    {t("privacyPolicy")}
                </TextBlock>
            </View>
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
    },
    description: {
        verticalAlign: "middle",
        color: "#FFFFFF",
        paddingHorizontal: 32,
        paddingVertical: 4,
        justifyContent: "center",
        alignItems: "center"
    },
    createOption: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    questionAccount: {
        color: Colors.light.text.secondary
    },
    create: {
        color: Colors.light.icon.primary
    },
    divider: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    dividerLine: {
        height: 1,
        backgroundColor: Colors.light.text.secondary,
        flex: 1
    },
    termsAndPolicy: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
})