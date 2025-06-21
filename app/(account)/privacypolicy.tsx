import { Asset } from "expo-asset";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import Pdf from "react-native-pdf";

export default function PrivacyPolicy() {
    const [androidPdf, setAndroidPdf] = useState<string | null>(null);
    const pdfSource = Platform.OS == 'ios' ? require("../../assets/docs/privacypolicy.pdf") : {uri: androidPdf}

    useEffect(() => {
        const loadPdf = async () => {
            const pdf = await Asset.loadAsync(require("../../assets/docs/privacypolicy.pdf"))
            setAndroidPdf(pdf[0]?.localUri || pdf[0]?.uri);
        }
        loadPdf();
    }, [])
    return (
        <Pdf
            source={pdfSource}
            style={{
                flex: 1,
                width: "100%",
                height: "100%",
            }}
        />
    );
}