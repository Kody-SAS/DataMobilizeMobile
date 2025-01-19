import WebView from "react-native-webview";

export default function PrivacyPolicy() {
    return (
        <WebView
            source={{uri: process.env.PRIVACY_POLICY_URL}}
            style={{
                flex: 1,
                width: "100%",
                height: "100%",
            }}
        />
    );
}