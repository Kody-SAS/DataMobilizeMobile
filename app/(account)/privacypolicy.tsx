import { Platform } from "react-native";
import Pdf from "react-native-pdf";

export default function PrivacyPolicy() {
    const pdfSource = Platform.OS == 'ios' ? require("../../assets/docs/privacypolicy.pdf") : {uri: "bundle-assets://privacypolicy.pdf"}
    
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