import WebView from "react-native-webview";

export default function TermsOfService() {

  const wordFileUrl = "https://docs.google.com/document/d/1gUIlFjqz0_OHuxxwGn0g5KqpNaIxqlPj/edit";
    return (
        <WebView
            source={{uri: wordFileUrl}}
            style={{
                flex: 1,
                width: "100%",
                height: "100%",
            }}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
        />
    )
}