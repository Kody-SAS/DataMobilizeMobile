import Toast from "react-native-toast-message";
import { FontsEnum, FontSizesEnum, FontWeightsEnum, LineHeightsEnum } from "../type.d";

export default function ToastMessage(type: "success" | "error" | "info", text1: string, text2: string) {
    Toast.show({
        type,
        text1,
        text2,
        text1Style: {
            fontSize: FontSizesEnum.title,
            fontFamily: FontsEnum.title,
            fontWeight: FontWeightsEnum.medium,
            lineHeight: LineHeightsEnum.title,
        },
        text2Style: {
            fontSize: FontSizesEnum.body,
            fontFamily: FontsEnum.body,
            fontWeight: FontWeightsEnum.regular,
            lineHeight: LineHeightsEnum.body,
        },
    })
}