import { StyleSheet, View, Text } from "react-native";
import { TextBlock } from "../../components/TextBlock";
import { Spacer } from "../../components/Spacer";
import { TextInput } from "react-native-paper";
import { ButtonAction } from "../../components/ButtonAction";
import { ButtonTypeEnum, CreateUser, TextBlockTypeEnum, User } from "../../type";
import { Colors } from "../../constants/Colors";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ToastMessage from "../../utils/Toast";
import { useNetInfo } from "@react-native-community/netinfo";
import { selectCreateUser, selectUser, sendForgotPasswordCode, sendValidationCode, validateCode, validateForgotPasswordCode } from "../../redux/slices/accountSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function LoginCodeCard() {
    const [code, setCode] = useState<string>("");
    
    const {isConnected} = useNetInfo()

    const { t } = useTranslation();
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const createUser: CreateUser = useSelector(selectCreateUser);
    const user: User = useSelector(selectUser);
    const inputs: any[] = [];
  
    const handleChange = (text: string, index: number) => {
        if (/^\d?$/.test(text)) { // Only allow digits and empty text
            let newCode : string[] = [];
            
            for(let i = 0; i < code.length; i++) {
                newCode.push(code[i]);
            }
            newCode[index] = text;
            setCode(newCode.join(""));
    
            if (text !== '' && index < 3) {
                inputs[index + 1].focus();
            }
        }
    };

    const resendCode = async () => {
        if (!isConnected) {
            ToastMessage("error", t("error"), t("connectAndTryAgain"));
            return;
        }

        dispatch(validateForgotPasswordCode({
            userId: "fsdfsdf",
            code
        }))

        ToastMessage("success", t("success"), t("codeSentToEmail"));
    }

    const verifyCode = async () => {
        router.push("/(tabs)/");
        return;
        if (!isConnected) {
            ToastMessage("error", t("error"), t("connectAndTryAgain"));
            return;
        }

        dispatch(validateCode({userId: user.id!, code: code}))
    }

    return (
        <SafeAreaView style={styles.container}>
            <TextBlock type={TextBlockTypeEnum.title}>
                {t("enterCode")}
            </TextBlock>
            <Spacer position="bottom" variant="large" />
            <Spacer position="bottom" variant="large" />
            <Spacer position="bottom" variant="medium" />
            <View style={styles.codeContainer}>
            {[0, 1, 2, 3].map((digit, index) => (
                <TextInput
                    key={index}
                    mode="outlined"
                    style={styles.input}
                    contentStyle={{
                        fontSize: 32,
                        fontWeight: "600",
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        alignContent: "center",
                        height: 72
                    }}
                    keyboardType="numeric"
                    activeOutlineColor={Colors.light.background.primary}
                    maxLength={1}
                    onChangeText={text => handleChange(text, index)}
                    ref={(input: any) => (inputs[index] = input)}
                />
            ))}
            </View>

            <Spacer position="bottom" variant="large" />
            <Spacer position="bottom" variant="medium" />
            <TextBlock type={TextBlockTypeEnum.body}>
                {t("notReceivedCode")} <TextBlock type={TextBlockTypeEnum.body} style={styles.resend} onPress={resendCode}>{t("resend")}</TextBlock>
            </TextBlock>
            <Spacer position="bottom" variant="large" />
            <Spacer position="bottom" variant="large" />
            <Spacer position="bottom" variant="medium" />

            <ButtonAction 
                onPress={async() => await verifyCode()}
                disabled={code.length != 4}
                variant={ButtonTypeEnum.primary}
                content={
                    <TextBlock type={TextBlockTypeEnum.title} style={styles.description}>
                        {t("verify")}
                    </TextBlock>
                }
                style={{
                    opacity: code.length != 4 ? 0.3 : 1
                }}
            />
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
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    codeInput: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        textAlign: 'center',
    },
    description: {
        verticalAlign: "middle",
        color: "#FFFFFF",
        paddingHorizontal: 32,
        paddingVertical: 4,
        justifyContent: "center",
        alignItems: "center"
    },
    input: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: 'gray',
        textAlign: 'center',
        fontSize: 18,
        marginRight: 10,
        alignContent: "center",
        alignItems: "center",
    },
    resend:{
        color: "blue",
        textDecorationStyle: "solid",
        textDecorationLine: "underline"
    }
})