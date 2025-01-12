import WebView from "react-native-webview";

export default function TermsOfService() {
    return (
        <WebView
            source={{uri: process.env.TERMS_OF_SERVICE_URL}}
            style={{
                flex: 1,
                width: "100%",
                height: "100%",
            }}
        />
    )
}