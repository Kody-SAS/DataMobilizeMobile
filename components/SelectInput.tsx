import { FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { Colors } from "../constants/Colors"
import { TextBlock } from "./TextBlock";
import { ButtonAction } from "./ButtonAction";
import { ButtonTypeEnum, TextBlockTypeEnum } from "../type.d";
import { useTranslation } from "react-i18next";
import { SetStateAction, useState } from "react";
import { Spacer } from "./Spacer";

export type SelectedOption = {
    imageUrl?: any;
    content: string;
    data: any;
}
export type SelectInputProps = {
    title: string;
    buttonText: string;
    selectionList: SelectedOption[];
    selectedInput: SelectedOption | undefined;
    setSelectedInput: React.Dispatch<SetStateAction<SelectedOption | undefined>>;
    onInputSelect?: () => void;
    horizontal?: boolean;
}

export const SelectInput = ({
    title,
    buttonText,
    selectionList,
    selectedInput,
    setSelectedInput,
    onInputSelect,
    horizontal = true
}: SelectInputProps) => {
    const [isOptionChange, setIsOptionChange] = useState<boolean>(false);
    const {t} = useTranslation();

    const handleOptionChange = (item: SelectedOption) => {
        setSelectedInput(item);
        setIsOptionChange(false);
        if (onInputSelect) onInputSelect();
    }

    const handleActivateChange = () => {
        setIsOptionChange(true);
    }

    return (
        <View>
            <View style={styles.heading}>
                <TextBlock type={TextBlockTypeEnum.title}>{title}</TextBlock>
                {!isOptionChange && (
                    <ButtonAction
                        variant={ButtonTypeEnum.quarternary}
                        onPress={handleActivateChange}
                        content={
                            <TextBlock type={TextBlockTypeEnum.body} style={{color: Colors.light.background.primary}}>{buttonText}</TextBlock>
                        }
                    />
                )}
            </View>
            {isOptionChange ? (
                <FlatList
                    data={selectionList}
                    renderItem={({item, index}) => {
                        return (
                            <TouchableOpacity 
                                id={index.toString()}
                                onPress={() => handleOptionChange(item)}
                                style={styles.listItemContainer}
                                >
                                {item.imageUrl && (
                                    <>
                                        <Image
                                            source={item.imageUrl}
                                            style={{width: 60, height: 60}}
                                            resizeMode="contain"
                                        />
                                        <Spacer variant="medium" />
                                    </>
                                )}
                                <TextBlock type={TextBlockTypeEnum.caption} style={{textAlign: 'center', paddingHorizontal: !horizontal ? 16 : undefined, paddingVertical: !horizontal ? 8 : undefined}}>{item.content}</TextBlock>
                            </TouchableOpacity>
                        )
                    }}
                    showsHorizontalScrollIndicator={true}
                    horizontal={horizontal}
                    keyExtractor={item => item.imageUrl}
                />
            ): (
                <TouchableOpacity
                    onPress={handleActivateChange}
                    style={styles.content}>
                        {selectedInput ? (
                                <>
                                    {selectedInput?.imageUrl && (
                                        <Image
                                            source={selectedInput?.imageUrl}
                                            style={{width: 35, height: 35, marginRight: 8}}
                                            resizeMode="contain"
                                        />
                                    )}
                                    <TextBlock type={TextBlockTypeEnum.body}>{selectedInput?.content}</TextBlock>
                                </>
                            )
                            : (
                                <TextBlock type={TextBlockTypeEnum.body}>{t("clickToSelect")}</TextBlock>
                            )
                        }
                </TouchableOpacity>
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
        alignItems: 'center',
        height: 45
    },
    listItemContainer: {
        width: 65,
        height: 100,
        margin: 4
    }
})