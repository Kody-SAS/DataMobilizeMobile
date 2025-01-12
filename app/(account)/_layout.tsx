import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function AccountLayout() {
    const {t} = useTranslation();
    return (
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false}} />
            <Stack.Screen name="register" options={{headerShown: false}} />
            <Stack.Screen name="forgot" options={{headerShown: false}} />
            <Stack.Screen name="verify" options={{title: t("verification")}} />
            <Stack.Screen name="termsofservice" options={{title: t("termsOfService")}} />
            <Stack.Screen name="privacypolicy" options={{title: t("privacyPolicy")}} />
        </Stack>
    )
}