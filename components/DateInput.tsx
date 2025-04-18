import { StyleSheet, TouchableOpacity, View, Platform } from "react-native"
import { TextBlock } from "./TextBlock"
import { useTranslation } from "react-i18next"
import { TextBlockTypeEnum } from "../type.d";
import { Spacer } from "./Spacer";
import React, { SetStateAction, useState } from "react";
import { Colors } from "../constants/Colors";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

export type DateInputProps = {
    placeholder?: string;
    date: Date;
    setDate: React.Dispatch<SetStateAction<Date>>;
    mode?: "date" | "time" | "datetime";
    onChange?: (date: Date) => void;
}

export const DateInput = ({
    placeholder = "",
    date,
    setDate,
    mode = "datetime",
    onChange
}: DateInputProps) => {
    const {t} = useTranslation();
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [showFirstDatePicker, setShowFirstDatePicker] = useState<boolean>(false);
    const [showSecondDatePicker, setShowSecondDatePicker] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState(new Date(Date.now()));
    const [selectedTime, setSelectedTime] = useState(new Date(Date.now()));

    // When both are selected, combine them:
    const getCombinedDateTime = () => {
        const combineDate = new Date(selectedDate);
        const combineTime = new Date(selectedTime);

        const combined = new Date(
            combineDate.getFullYear(),
            combineDate.getMonth(),
            combineDate.getDate(),
            combineTime.getHours(),
            combineTime.getMinutes(),
            combineTime.getSeconds()
        );

        setDate(combined);

        if (onChange) onChange(combined);
    };

    const handleShowDatePicker = () => {
        setShowDatePicker(true);
        setShowFirstDatePicker(true);
    }

    const handleDateChanged = (event: DateTimePickerEvent, date?: Date) => {
        setDate(date!);
        setShowDatePicker(false);

        if (onChange) onChange(date!);
    }

    const handleSelectedDateChange = (event: DateTimePickerEvent, date?: Date) => {
        if (event.type === "dismissed") {
            setShowFirstDatePicker(false);
            setShowSecondDatePicker(false);
            return;
        }
        setSelectedDate(date!);
        setShowFirstDatePicker(false);
        setShowSecondDatePicker(true);
    }

    const handleSelectedTimeChange = (event: DateTimePickerEvent, date?: Date) => {
        if (event.type === "dismissed") {
            setShowFirstDatePicker(true);
            setShowSecondDatePicker(false);
            return;
        }
        setSelectedTime(date!);
        setShowFirstDatePicker(false);
        setShowSecondDatePicker(false);
        getCombinedDateTime();
    }

    return (
        <View>
            <TextBlock type={TextBlockTypeEnum.title}>{placeholder.length > 0 ? placeholder : t("chooseDate")}</TextBlock>
            <Spacer variant="medium" />
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleShowDatePicker}
                style={styles.dateContainer}
            >
                <TextBlock type={TextBlockTypeEnum.body}>{date.toLocaleDateString()}{mode == 'datetime' ? ", " + date.toLocaleTimeString() : ""}</TextBlock>
            </TouchableOpacity>
            {showDatePicker && (
                <>
                    {Platform.OS == "ios" ? (
                        <RNDateTimePicker
                            mode={mode}
                            value={date}
                            onChange={handleDateChanged}
                        />
                    ) : (
                        <>
                            {mode === "datetime" ? (
                                <>
                                    {showFirstDatePicker && (
                                        <RNDateTimePicker
                                            mode={"date"}
                                            value={selectedDate}
                                            onChange={handleSelectedDateChange}
                                        />
                                    )}
                                    {showSecondDatePicker && (
                                        <RNDateTimePicker
                                            mode={"time"}
                                            value={selectedTime}
                                            onChange={handleSelectedTimeChange}
                                        />
                                    )}
                                </>
                            ) : (
                                <RNDateTimePicker
                                    mode={mode}
                                    value={date}
                                    onChange={handleDateChanged}
                                />
                            )}
                        </>
                    )}
                </>
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