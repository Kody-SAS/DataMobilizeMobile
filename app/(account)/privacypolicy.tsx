import Pdf from "react-native-pdf";

export default function PrivacyPolicy() {
    return (
        <Pdf
            source={{uri: "../../assets/docs/privacypolicy.pdf"}}
            style={{
                flex: 1,
                width: "100%",
                height: "100%",
            }}
        />
    );
}