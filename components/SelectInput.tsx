import { Image, StyleSheet, View } from "react-native"
import { Colors } from "../constants/Colors"
import { TextBlock } from "./TextBlock";
import { ButtonAction } from "./ButtonAction";
import { ButtonTypeEnum, TextBlockTypeEnum } from "../type";
import { useTranslation } from "react-i18next";
import { SetStateAction, useState } from "react";

export type SelectedOption = {
    imageUrl: any;
    content: string;
    data: any;
}
export type SelectInputProps = {
    title: string;
    buttonText: string;
    selectedInput: SelectedOption;
    setSelectedInput: React.Dispatch<SetStateAction<SelectedOption>>;
}

export const SelectInput = ({
    title,
    buttonText,
    selectedInput,
    setSelectedInput
}: SelectInputProps) => {
    const [isOptionChange, setIsOptionChange] = useState<boolean>(false);
    const {t} = useTranslation();

    const handleOptionChange = (item: SelectedOption) => {
        setSelectedInput(item);
        setIsOptionChange(false);
    }

    const handleActivateChange = () => {
        setIsOptionChange(true);
    }

    return (
        <View>
            <View style={styles.heading}>
                <TextBlock>{title}</TextBlock>
                {!isOptionChange && (
                    <ButtonAction
                        variant={ButtonTypeEnum.quarternary}
                        onPress={handleActivateChange}
                        content={
                            <TextBlock type={TextBlockTypeEnum.body}>{t("change")}</TextBlock>
                        }
                    />
                )}
            </View>
            {isOptionChange ? (
                <View>
                    
                </View>
            ): (
                <View style={styles.content}>
                    <Image
                        source={selectedInput.imageUrl}
                    />
                    <TextBlock type={TextBlockTypeEnum.body}>{selectedInput.content}</TextBlock>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    heading: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
    },
    content: {
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: Colors.light.background.tertiary,
        padding: 8,
        flexDirection: "row",
    }
})