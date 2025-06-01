import { useState } from "react";
import WebView from "react-native-webview";

export default function Export() {
    const [pdfUrl, setPdfUrl] = useState<string>("");

    
    return (
        <WebView
            source={{uri: pdfUrl}}
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