import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function HomeStackLayout() {
    const { t } = useTranslation();
    return (
        <Stack>
            <Stack.Screen name='report' options={{ title: t('report') }} />
            <Stack.Screen name='findsupport' options={{ title: t('findSupport') }} />
        </Stack>
    )
}