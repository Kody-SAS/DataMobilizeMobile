import { Stack } from "expo-router";

export default function AccountLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false}} />
            <Stack.Screen name="register" options={{headerShown: false}} />
            <Stack.Screen name="forgot" options={{headerShown: false}} />
            <Stack.Screen name="verify" options={{headerShown: false}} />
            <Stack.Screen name="termsandconditions" options={{headerShown: false}} />
            <Stack.Screen name="privacypolicy" options={{headerShown: false}} />
        </Stack>
    )
}