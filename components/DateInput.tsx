import { StyleSheet, TouchableOpacity, View } from "react-native"
import { TextBlock } from "./TextBlock"
import { useTranslation } from "react-i18next"
import { TextBlockTypeEnum } from "../type.d";
import { Spacer } from "./Spacer";
import React, { SetStateAction, useState } from "react";
import { Colors } from "../constants/Colors";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

export type DateInputProps = {
    date: Date;
    setDate: React.Dispatch<SetStateAction<Date>>;
}

export const DateInput = ({
    date,
    setDate
}: DateInputProps) => {
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const {t} = useTranslation();

    const handleShowDatePicker = () => {
        setShowDatePicker(true);
    }

    const handleDateChanged = (event: DateTimePickerEvent, date?: Date) => {
        setDate(date!);
        setShowDatePicker(false);
    }

    return (
        <View>
            <TextBlock type={TextBlockTypeEnum.title}>{t("chooseDate")}</TextBlock>
            <Spacer variant="medium" />
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleShowDatePicker}
                style={styles.dateContainer}
            >
                <TextBlock type={TextBlockTypeEnum.body}>{date.toLocaleDateString()}</TextBlock>
            </TouchableOpacity>
            {showDatePicker && (
                <RNDateTimePicker
                    mode="date"
                    value={date}
                    onChange={handleDateChanged}
                 />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    dateContainer: {
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: Colors.light.background.tertiary,
        paddingHorizontal: 8,
        paddingVertical: 12,
        flexDirection: "row",
    }
})