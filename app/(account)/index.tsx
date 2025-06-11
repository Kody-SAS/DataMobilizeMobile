import React, { useState } from "react";
import { View, StyleSheet, Platform, Image, ScrollView } from "react-native";
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
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const {isConnected} = useNetInfo();
    const {t} = useTranslation();
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

    const handleLogin = () => {
        if (!isConnected) {
            ToastMessage("error", t("error"), t("connectAndTryAgain"));
            return;
        }

        if(!email || !password) {
            setErrorMessage(t("fillAllFields"));
            return;
        }
        
        setErrorMessage("");
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

    const handleTermsOfService = () => {
        router.push("/(account)/termsofservice");
    }

    const handlePrivacyPolicy = () => {
        router.push("/(account)/privacypolicy");
    }

    const handleNavigationToForgot = () => {
        router.push("/(account)/forgot");
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
            <Spacer variant="large" />
            <Spacer variant="large" />
            <Spacer variant="large" />

            <TextBlock type={TextBlockTypeEnum.h1} style={{ textAlign: "center" }}>
                DataMobilize
            </TextBlock>
            <Spacer variant="large" />
            <Spacer variant="large" />
            <TextBlock type={TextBlockTypeEnum.h4} style={{ textAlign: "center" }}>
                {t("welcomeBack")}
            </TextBlock>
            <Spacer variant="medium" />

            <TextBlock type={TextBlockTypeEnum.body} style={{ textAlign: "center" }}>
                {t("loginToContinue")}
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
                onPress={handleLogin}
            />
            <Spacer variant="large" />
            <Spacer variant="large" />
            <View style={styles.createOption}>
                <TextBlock type={TextBlockTypeEnum.body} style={styles.questionAccount}>
                    {t("noAccountQuestion")}
                </TextBlock>
                <ButtonAction
                    variant={ButtonTypeEnum.quarternary}
                    content={
                        <TextBlock type={TextBlockTypeEnum.body} style={styles.primaryText}>
                            {t("create")}
                        </TextBlock>}
                    onPress={handleNavigationToRegister}
                />
            </View>
            <Spacer variant="large" />

            <View style={styles.createOption}>
                <TextBlock type={TextBlockTypeEnum.body} style={styles.questionAccount}>
                    {t("forgotQuestion")}
                </TextBlock>
                <ButtonAction
                    variant={ButtonTypeEnum.quarternary}
                    content={
                        <TextBlock type={TextBlockTypeEnum.body} style={styles.primaryText}>
                            {t("changePassword")}
                        </TextBlock>}
                    onPress={handleNavigationToForgot}
                />
            </View>
            <Spacer variant="large" />
            <Spacer variant="medium" />

            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <TextBlock type={TextBlockTypeEnum.body} style={styles.secondaryText}>
                    {t("or")}
                </TextBlock>
                <View style={styles.dividerLine} />
            </View>
            <Spacer variant="large" />
            <Spacer variant="medium" />
            <ButtonAction
                variant={ButtonTypeEnum.secondary}
                content={
                    <View style={styles.socialBtnContainer}>
                        <Image
                            source={require("../../assets/images/GoogleLogo.png")}
                            style={styles.btnLogo}
                            resizeMode="contain" />
                        <TextBlock type={TextBlockTypeEnum.body}>
                            {t("continueWithGoogle")}
                        </TextBlock>
                    </View>
                    }
                onPress={handleSigninWithGoogle}
            />
            {
                Platform.OS != "ios" &&
                <>
                    <Spacer variant="medium" />
                    <ButtonAction
                        variant={ButtonTypeEnum.secondary}
                        content={
                            <View style={styles.socialBtnContainer}>
                                <Image
                                    source={require("../../assets/images/AppleLogo.png")}
                                    style={styles.btnLogo}
                                    resizeMode="contain" />
                                <TextBlock type={TextBlockTypeEnum.body}>
                                    {t("continueWithApple")}
                                </TextBlock>
                            </View>
                            }
                        onPress={handleSigninWithApple}
                    />
                </>
            }
            <Spacer variant="large" />
            <Spacer variant="small" />

            <View style={styles.termsAndPolicy}>
                <TextBlock type={TextBlockTypeEnum.body} style={styles.secondaryText}>
                    {t("informPrivacyPolicy")}
                </TextBlock>
                <ButtonAction
                    variant={ButtonTypeEnum.quarternary}
                    content={
                        <TextBlock type={TextBlockTypeEnum.body} style={styles.primaryText}>
                            {t("privacyPolicy")}
                        </TextBlock>
                    }
                    onPress={handlePrivacyPolicy}
                />
            </View>
            </ScrollView>
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
    primaryText: {
        color: Colors.light.background.primary
    },
    secondaryText: {
        color: Colors.light.text.secondary
    },
    divider: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    dividerLine: {
        height: 0.5,
        backgroundColor: Colors.light.text.secondary,
        flex: 1,
        marginHorizontal: 8
    },
    termsAndPolicy: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    socialBtnContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    btnLogo: {
        width: 20,
        height: 20,
        marginRight: 8
    }
})